export function Footer() {
  const platformLinks = ['Home', 'Dashboard', 'Students', 'Courses'];
  const resourceLinks = ['Docs', 'API', 'Support'];
  const legalLinks = ['Terms', 'Privacy'];

  return (
    <footer
      className="mt-16 px-8 py-12"
      style={{
        backgroundColor: '#1E293B',
        borderTop: '1px solid rgba(34, 211, 238, 0.2)'
      }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div
              className="mb-4"
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
            >
              LearnU2
            </div>
            <p style={{ color: '#CAD8E4', opacity: 0.8 }}>
              A modern university dashboard platform designed to streamline academic management and enhance student success.
            </p>
            <div
              className="mt-6"
              style={{
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #22D3EE 0%, transparent 100%)',
                borderRadius: '2px'
              }}
            />
          </div>

          {/* Platform Links */}
          <div>
            <h4
              className="mb-4"
              style={{
                color: '#FFFFFF',
                fontWeight: 600
              }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#22D3EE]"
                    style={{ color: '#CAD8E4', opacity: 0.8 }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4
              className="mb-4"
              style={{
                color: '#FFFFFF',
                fontWeight: 600
              }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#22D3EE]"
                    style={{ color: '#CAD8E4', opacity: 0.8 }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="mb-4"
              style={{
                color: '#FFFFFF',
                fontWeight: 600
              }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#22D3EE]"
                    style={{ color: '#CAD8E4', opacity: 0.8 }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          className="pt-8 border-t"
          style={{
            borderColor: 'rgba(202, 216, 228, 0.2)'
          }}
        >
          <p style={{ color: '#CAD8E4', opacity: 0.7, textAlign: 'center' }}>
            © 2025 LearnU2. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
