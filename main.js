const { error } = require("./lib/dialogs.js");
const { Text, Rectangle, Color } = require("scenegraph");

function textVerticalMiddle(selection) {
  let countAreatext = 0;
  for (let i = 0; i < selection.items.length; i++) {
    if(selection.items[i] instanceof Text === true && selection.items[i].areaBox) {
      verticalMiddle(selection, selection.items[i]);
      countAreatext += 1;
    }
  }
  if(!countAreatext) {
    alertSelectAreatext();
  }
}

function verticalMiddle(selection, item) {
  let target = item;

  const shape = new Rectangle();
  shape.width = target.localBounds.width;
  shape.height = target.localBounds.height;
  shape.fill = new Color("#fff", "0");
  selection.insertionParent.addChild(shape);
  shape.moveInParentCoordinates(target.boundsInParent.x, target.boundsInParent.y);

  trimText(target);
  const diff = shape.height - target.localBounds.height;
  target.moveInParentCoordinates(0, diff/2);
}

function alertSelectAreatext() {
  error("Ooops", "You need to select area texts.");
}

function trimText(node) {
  let style = node.styleRanges[0];
  let increment = style.lineSpacing || style.fontSize;

  if (!node.clippedByArea) { increment = -increment; }

  let height = node.areaBox.height;

  for (; Math.abs(increment) >= 1; increment = -Math.trunc(increment / 2)) {
    let origValue = node.clippedByArea;

    while (node.clippedByArea === origValue) {
      height += increment;
      node.resize(node.areaBox.width, height);
    }
  }

  if (node.clippedByArea) {
    node.resize(node.areaBox.width, height + 1);
  }
}

module.exports = {
  commands: {
    myPluginCommand: textVerticalMiddle
  }
};
