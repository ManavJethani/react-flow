import React from 'react'
const HighlightedText = ({ text, offsets }) => {

  const renderHighlightedText = () => {
    const sortedOffsets = offsets.sort((a, b) => a.startOffset - b.startOffset);

    let lastIndex = 0;
    const highlightedTextElements = sortedOffsets.map((offset, index) => {
      const { startOffset, endOffset, color } = offset;

      const unhighlightedText = text.substring(lastIndex, startOffset);
      const highlightedText = text.substring(startOffset, endOffset);

      lastIndex = endOffset;

      return (
        <React.Fragment key={index}>
          <span>{unhighlightedText}</span>
          <span style={{ backgroundColor: color }}>{highlightedText}</span>
        </React.Fragment>
      );
    });

    const remainingText = text.substring(lastIndex);

    return (
      <span>
        {highlightedTextElements}
        {remainingText}
      </span>
    );
  };

  return (
    <div>
      <p>{renderHighlightedText()}</p>
    </div>
  );
};

export default HighlightedText