import { forwardRef } from 'react';

const Section = forwardRef(({ children, className = "" }, ref) => (
  <section ref={ref} className={`py-16 md:py-20 ${className}`}>
    {children}
  </section>
));

Section.displayName = 'Section';

export default Section;
