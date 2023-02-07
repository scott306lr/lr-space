import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function readingTimeRemarkPlugin() {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);
    // const readingTime = getReadingTime(textOnPage).time;
    file.data.astro.frontmatter.minutesRead = readingTime;
  };
}
