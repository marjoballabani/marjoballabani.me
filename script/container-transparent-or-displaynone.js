function setContainerTransparentOrDisplaynone() {
  "internet explorer" == browserName && browserVersion <= 8
    ? containerDiv.setAttribute("class", "displaynone")
    : containerDiv.setAttribute("class", "transparent");
}
var containerDiv = document.getElementById("container");
setContainerTransparentOrDisplaynone();
