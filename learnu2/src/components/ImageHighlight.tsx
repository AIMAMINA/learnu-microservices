import { ImageWithFallback } from './figma/ImageWithFallback';

export function ImageHighlight() {
  return (
    <div className="px-8 py-12">
      <div className="max-w-[1600px] mx-auto">
        <div 
          className="relative overflow-hidden"
          style={{ 
            borderRadius: '20px',
            height: '400px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          {/* Background Image */}
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1685456891912-c09f9cd252eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDF8fHx8MTc2MzM0NzM1MXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Modern university campus"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(30, 41, 59, 0.4) 100%)'
            }}
          />

          {/* Text Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center px-8">
            <div className="text-center max-w-3xl">
              <h2 
                className="mb-4"
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  letterSpacing: '-0.03em',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                Empowering Students with Smart Tools
              </h2>
              <p 
                style={{ 
                  color: '#CAD8E4',
                  fontWeight: 400
                }}
              >
                Leverage cutting-edge technology to enhance learning experiences and drive academic excellence.
              </p>

              {/* Decorative line */}
              <div 
                className="mt-8 mx-auto"
                style={{
                  width: '120px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #22D3EE 50%, transparent 100%)',
                  borderRadius: '2px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
