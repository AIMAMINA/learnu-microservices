from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from transformers import pipeline
import json
import re

# ============================================================
# 🔹 Chargement des modèles une seule fois au démarrage
# ============================================================
translator_fr_en = pipeline("translation", model="Helsinki-NLP/opus-mt-fr-en")   # Français → Anglais
translator_en_fr = pipeline("translation", model="Helsinki-NLP/opus-mt-en-fr")   # Anglais → Français
summarizer_multi = pipeline("summarization", model="csebuetnlp/mT5_multilingual_XLSum")

# ============================================================
# 🔹 Détection automatique de la langue
# ============================================================
def detect_language(text):
    """Retourne 'fr' si le texte semble français, sinon 'en'."""
    t = text.lower()
    if re.search(r"[éèàùçâêîôû]|\b(le|la|les|de|des|et|est|bonjour|merci)\b", t):
        return "fr"
    if re.search(r"\b(the|and|you|is|are|this|that|hello|thank|with|from)\b", t):
        return "en"
    return "fr"

# ============================================================
# 🔹 Résumé intelligent adaptatif
# ============================================================
def get_summary(text, model):
    """Crée un résumé adapté à la longueur du texte (même s’il est long)."""
    words = text.split()
    nb_words = len(words)

    if nb_words < 10:
        return text.capitalize()

    # Ajustement automatique
    if nb_words < 50:
        max_len, min_len = 40, 10
    elif nb_words < 150:
        max_len, min_len = 80, 25
    elif nb_words < 300:
        max_len, min_len = 120, 40
    else:
        max_len, min_len = 200, 70

    try:
        # Si texte trop long → découpage en chunks
        if nb_words > 400:
            parts = []
            chunk_size = 350
            for i in range(0, nb_words, chunk_size):
                chunk = " ".join(words[i:i + chunk_size])
                if len(chunk) > 2000:
                    chunk = chunk[:2000]
                try:
                    part_summary = model(
                        chunk,
                        max_length=max_len,
                        min_length=min_len,
                        truncation=True,
                        do_sample=False
                    )[0]["summary_text"]
                    parts.append(part_summary.strip())
                except Exception as e:
                    print(f"⚠️ Erreur chunk {i//chunk_size+1}:", e)
                    parts.append(chunk[:200])
            return " ".join(parts)

        # Cas normal
        summary = model(
            text,
            max_length=max_len,
            min_length=min_len,
            truncation=True,
            do_sample=False
        )[0]["summary_text"]
        return summary.strip()

    except Exception as e:
        print("❌ Erreur dans get_summary:", e)
        return text


# ============================================================
# 🔹 Nettoyage
# ============================================================
def clean_summary(summary, original):
    """Supprime les phrases redondantes."""
    if not summary:
        return original
    sentences = summary.split(".")
    filtered = [s.strip() for s in sentences if s and s.lower() not in original.lower()]
    return ". ".join(filtered).strip() or summary


# ============================================================
# 🔹 Traduction seule
# ============================================================
def translate_text(text):
    """Traduit le texte automatiquement FR↔EN selon la langue détectée."""
    lang = detect_language(text)
    if lang == "fr":
        translated = translator_fr_en(text)[0]["translation_text"]
    else:
        translated = translator_en_fr(text)[0]["translation_text"]
    return translated


# ============================================================
# 🔹 Endpoint principal : /chatbot/process/
# ============================================================
@csrf_exempt
def process_text(request):
    """
    API POST : reçoit {text, mode}
    mode = "summary" → fait résumé + traduction du résumé
    mode = "translate" → fait traduction simple du texte
    """
    if request.method != "POST":
        return JsonResponse({"error": "Utilise POST avec un champ 'text'."}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
        text = data.get("text", "").strip()
        mode = data.get("mode", "summary")

        if not text:
            return JsonResponse({"error": "Aucun texte fourni."}, status=400)

        lang = detect_language(text)

        # -------------------------------------------------------
        # 🔸 MODE 1 : Traduction simple
        # -------------------------------------------------------
        if mode == "translate":
            translated = translate_text(text)
            return JsonResponse({
                "detected_language": lang,
                "original_text": text,
                "translated_text": translated
            }, json_dumps_params={"ensure_ascii": False}, status=200)

        # -------------------------------------------------------
        # 🔸 MODE 2 : Résumé complet + traduction du résumé
        # -------------------------------------------------------
        translated = translate_text(text)

        summary_original = get_summary(text, summarizer_multi)
        summary_translated = get_summary(translated, summarizer_multi)

        summary_original = clean_summary(summary_original, text)
        summary_translated = clean_summary(summary_translated, translated)

        return JsonResponse({
            "detected_language": lang,
            "original_text": text,
            "translated_text": translated,
            "summary_original": summary_original,
            "summary_translated": summary_translated
        }, json_dumps_params={"ensure_ascii": False}, status=200)

    except Exception as e:
        print("❌ Erreur :", e)
        return JsonResponse({"error": str(e)}, status=500)
