/* global React */

const TextBlock = ({block}) => {
  const bgImage = block.backgroundImage && block.backgroundImage.asset && window.sanity
    ? window.sanity.imageUrl(block.backgroundImage, {width: 1400})
    : null;

  const style = {};
  if (block.backgroundColor) style.backgroundColor = block.backgroundColor;
  if (block.textColor) style.color = block.textColor;
  if (bgImage) {
    style.backgroundImage = `url(${bgImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  return (
    <section
      className={`page-section page-section--text align-${block.alignment || 'left'}`}
      style={style}
    >
      <div className="container">
        {block.headline && <h2 className="page-section-headline">{block.headline}</h2>}
        {block.body && <p className="page-section-body">{block.body}</p>}
      </div>
    </section>
  );
};

window.TextBlock = TextBlock;
