/* global React */

const QuoteBlock = ({block}) => {
  const s = {};
  if (block.backgroundColor)       s.backgroundColor = block.backgroundColor;
  if (block.textColor)              s.color           = block.textColor;
  if (block.paddingTop != null)     s.paddingTop      = block.paddingTop + 'px';
  if (block.paddingBottom != null) s.paddingBottom  = block.paddingBottom + 'px';

  return (
    <section className="page-section quote-block" style={s} data-align={block.alignment || 'left'}>
      <div className="container">
        <figure className="quote-block-figure">
          <blockquote className="quote-block-quote">
            {block.quote}
          </blockquote>
          {(block.author || block.companyRole) && (
            <figcaption className="quote-block-attribution">
              {block.author && <span className="quote-block-author">{block.author}</span>}
              {block.companyRole && <span className="quote-block-role">{block.companyRole}</span>}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
};

window.QuoteBlock = QuoteBlock;
