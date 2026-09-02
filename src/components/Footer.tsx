const SOCIAL_LINKS = ['GitHub', 'LinkedIn', 'Email'];

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest w-full py-lg border-t border-outline-variant/20 opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-md">
        <div className="font-label-caps text-label-caps text-on-surface-variant">
          © 2024 DEV_ARCHITECT // ENGINEERED FOR PERFORMANCE
        </div>
        <div className="flex gap-lg">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors font-code-sm text-code-sm"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
