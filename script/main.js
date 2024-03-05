function orientationChangeHandler(e) {
  disableScrollOrSwipe(),
    setTimeout(function () {
      $(window).trigger("resize");
    }, 500);
}

function enableScrollOrSwipe() {
  canScrollOrSwipe = !0;
}

function disableScrollOrSwipe() {
  canScrollOrSwipe = !1;
}

function initVariablesAfterShowContainer() {
  (fireworkCenterX = 0.5 * fireworkArray[0].offsetWidth),
    (fireworkCenterY = 0.5 * fireworkArray[0].offsetHeight),
    (fireworkOneRadiusDistance =
      (fireworkCenterY - fireworkDotRadius) / fireworkRowNumber),
    (fireworkOneRotationAngle = (2 * Math.PI) / fireworkColumnNumber);
}

function resetVariables() {
  (canAnimateBuildingInformation = canAnimatePlantInformation =
    !(pageVerticalPosition = 0)),
    0 == isFishStillAnimating && (canAnimateFishInformation = !0),
    0 == isCrabStillAnimating && (canAnimateCrabInformation = !0),
    0 == isTurtleStillAnimating && (canAnimateTurtleInformation = !0),
    (canDrawManyFireworks =
      canAnimateSocialContainer =
      canAnimateNbaInformation =
      canAnimateAlienInformation =
      canAnimateSquidInformation =
      canAnimateRobotInformation =
        !0);
}

function resetFunctions() {
  positionPlants(),
    positionBuildings(),
    0 == isFishStillAnimating &&
      positionSeaAnimals(fishArray, numberOfFishInEachRowArray, 150, 100),
    0 == isCrabStillAnimating &&
      positionSeaAnimals(crabArray, numberOfCrabInEachRowArray, 150, 100),
    0 == isTurtleStillAnimating &&
      positionSeaAnimals(turtleArray, numberOfTurtleInEachRowArray, 150, 100),
    positionNbaElements(),
    positionExperience1Elements(),
    positionExperience2Elements(),
    positionExperience3Elements(),
    positionSocialContainer(),
    positionExperienceTextContainer(),
    positionChainBlockAndStringContainer(),
    resetFireworkSvg();
}

function initTouchEvents() {
  document.addEventListener("touchstart", handleStart, !1),
    document.addEventListener("touchmove", handleMove, !1),
    document.addEventListener("touchend", handleEnd, !1);
}

function handleStart(e) {
  (touchStartX = e.targetTouches[0].pageX),
    (pageVerticalPositionOnTouch = pageVerticalPosition);
}

function handleMove(e) {
  e.preventDefault(),
    (touchCurrentX = e.targetTouches[0].pageX),
    1 == canScrollOrSwipe &&
      (detectPageVerticalPosition(), runTheseFunctionsAfterScrollOrSwipe());
}

function handleEnd(e) {
  e.preventDefault(), (touchEndX = e.changedTouches[0].pageX);
}

function runTheseFunctionsAfterScrollOrSwipe() {
  orientRobby(),
    checkRobbyJumpFallSwim(),
    moveLayers(),
    shiftUpDownHorizontalLayers(),
    animateInformationAndEnemiesElements(),
    animateRobbyRunSwim(),
    hideScrollOrSwipeTextContainer(),
    hideContactConfirmationContainer(),
    deviceFunctionScrollSwipe(),
    printScrollSwipeText();
}

function deviceFunctionScrollSwipe() {
  "computer" != deviceName &&
    "vertical" == layersMovement &&
    positionHorizontalLayersToHaveSameRightPosition();
}

function showContainer() {
  containerDiv.setAttribute("class", "");
}

function shiftUpHorizontalLayersAfterEverythingLoaded() {
  for (var e = 0; e < layerHorizontalArray.length; e++)
    $(layerHorizontalArray[e])
      .stop()
      .animate(
        {
          top: "0px",
        },
        1e3,
        function () {
          finishShiftUpHorizontalLayersAfterEverythingLoaded();
        }
      );
}

function finishShiftUpHorizontalLayersAfterEverythingLoaded() {
  1 == canFinishShiftUpHorizontalLayersAfterEverythingLoaded &&
    ((isPreloadShiftUpAnimationFinish =
      !(canFinishShiftUpHorizontalLayersAfterEverythingLoaded = !1)),
    makePageScrollable(),
    shiftDownRobbyContainer(),
    animateScrollOrSwipeTextContainer());
}

function shiftDownRobbyContainer() {
  setRobbyJumpDownAndFallFrame(),
    $(robbyContainerDiv)
      .stop()
      .animate(
        {
          bottom: "20%",
        },
        500,
        function () {
          setRobbyStaticFrame(), enableAnimateRobbyRunSwim();
        }
      ),
    "internet explorer" == browserName &&
      browserVersion <= 8 &&
      enableAnimateRobbyRunSwim();
}

function makePageScrollable() {
  contentDiv.setAttribute("class", ""), enableScrollOrSwipe();
}

function setFrontLayerVerticalHeight() {
  layerVerticalArray[layerVerticalArray.length - 1].style.height =
    2 * containerDiv.offsetHeight +
    bannersContainerDiv.offsetHeight +
    gapBetweenContactCloudAndBannersContainer +
    "px";
}

function setBannersContainerVerticalPosition() {
  bannersContainerDiv.style.bottom = containerDiv.offsetHeight + "px";
}

function setPageHeight() {
  pageDiv.style.height =
    layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
    containerDiv.offsetWidth +
    layerVerticalArray[layerVerticalArray.length - 1].offsetHeight +
    distanceBetweenRobbyAndBalloon +
    "px";
}

function setLayerSpeed() {
  for (; 0 < layerHorizontalSpeedArray.length; )
    layerHorizontalSpeedArray.pop();
  for (; 0 < layerVerticalSpeedArray.length; ) layerVerticalSpeedArray.pop();
  for (var e = 0; e < layerHorizontalArray.length; e++) {
    var t =
      (layerHorizontalArray[e].offsetWidth - containerDiv.offsetWidth) /
      (layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
        containerDiv.offsetWidth);
    layerHorizontalSpeedArray.push(t);
  }
  for (e = 0; e < layerVerticalArray.length; e++) {
    var i =
      (layerVerticalArray[e].offsetHeight - containerDiv.offsetHeight) /
      (layerVerticalArray[layerVerticalArray.length - 1].offsetHeight -
        containerDiv.offsetHeight);
    layerVerticalSpeedArray.push(i);
  }
}

function detectPageVerticalPosition() {
  (previousPageVerticalPosition = pageVerticalPosition),
    "computer" == deviceName
      ? (pageVerticalPosition =
          "internet explorer" == browserName
            ? document.documentElement.scrollTop
            : pageYOffset)
      : ((pageVerticalPosition =
          pageVerticalPositionOnTouch + (touchStartX - touchCurrentX)) < 0 &&
          (pageVerticalPosition = 0),
        pageVerticalPosition >
          pageDiv.offsetHeight - containerDiv.offsetHeight &&
          (pageVerticalPosition =
            pageDiv.offsetHeight - containerDiv.offsetHeight)),
    (deltaPageVerticalPosition =
      pageVerticalPosition - previousPageVerticalPosition),
    pageVerticalPosition <= 0 && (resetVariables(), resetFunctions());
}

function moveLayers() {
  if ((setLayersMovement(), "horizontal" == layersMovement)) {
    for (var e = 0; e < layerHorizontalArray.length; e++)
      layerHorizontalArray[e].style.left =
        -1 * layerHorizontalSpeedArray[e] * pageVerticalPosition + "px";
    positionLayerHorizontalToBottom(),
      clearHappyRobbyTimer(),
      positionVerticalLayersHorizontally();
  }
  if ("vertical" == layersMovement) {
    for (e = 0; e < layerVerticalArray.length; e++)
      layerVerticalArray[e].style.bottom =
        -1 *
          layerVerticalSpeedArray[e] *
          (pageVerticalPosition -
            (layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
              containerDiv.offsetWidth)) +
        "px";
    positionVerticalLayersAtLeftMost(),
      positionHorizontalLayersToHaveSameRightPosition(),
      positionHorizontalLayersVertically(),
      clearShiftRobbyFrameTimer(),
      clearHappyRobbyTimer();
  }
  "not moving 1" == layersMovement &&
    (positionVerticalLayersAtLeftMost(),
    positionVerticalLayersToHaveSameTopPosition(),
    positionHorizontalLayersAtBottomMost(),
    positionHorizontalLayersToHaveSameRightPosition(),
    clearHappyRobbyTimer()),
    "not moving 2" == layersMovement &&
      (positionVerticalLayersAtLeftMost(),
      positionVerticalLayersToHaveSameTopPosition(),
      positionHorizontalLayersAtBottomMost(),
      positionHorizontalLayersToHaveSameRightPosition(),
      animateSocialContainer(),
      happyRobby(),
      drawManyFireworks()),
    positionBalloonAndRobbyContainerHorizontally(),
    positionContactContainer(),
    positionFireworksContainer();
}

function positionVerticalLayersAtLeftMost() {
  for (var e = 0; e < layerVerticalArray.length; e++)
    layerVerticalArray[e].style.left = "0px";
}

function positionHorizontalLayersToHaveSameRightPosition() {
  for (var e = 0; e < layerHorizontalArray.length; e++)
    layerHorizontalArray[e].style.left =
      containerDiv.offsetWidth - layerHorizontalArray[e].offsetWidth + "px";
}

function positionHorizontalLayersVertically() {
  for (var e = 0; e < layerHorizontalArray.length; e++)
    layerHorizontalArray[e].style.top =
      layerVerticalArray[layerVerticalArray.length - 1].offsetTop +
      layerVerticalArray[layerVerticalArray.length - 1].offsetHeight -
      containerDiv.offsetHeight +
      "px";
}

function positionHorizontalLayersAtBottomMost() {
  for (var e = 0; e < layerHorizontalArray.length; e++)
    layerHorizontalArray[e].style.top =
      layerVerticalArray[layerVerticalArray.length - 1].offsetHeight -
      containerDiv.offsetHeight +
      "px";
}

function setRobbyLeftAndRightEdge() {
  (robbyRightEdge =
    0.5 * (containerDiv.offsetWidth + robbyDiv.offsetWidth) - 65),
    (robbyLeftEdge =
      0.5 * (containerDiv.offsetWidth - robbyDiv.offsetWidth) + 65);
}

function positionVerticalLayersToHaveSameTopPosition() {
  for (var e = 0; e < layerVerticalArray.length; e++)
    layerVerticalArray[e].style.bottom =
      containerDiv.offsetHeight - layerVerticalArray[e].offsetHeight + "px";
}

function positionVerticalLayersBottomToHorizontalLayersBottom() {
  for (var e = 0; e < layerVerticalArray.length; e++)
    layerVerticalArray[e].style.bottom =
      -1 * layerHorizontalArray[e].offsetTop + "px";
}

function shiftUpDownHorizontalLayers() {
  (previousPageVerticalPosition < sea1Div.offsetLeft - robbyLeftEdge ||
    previousPageVerticalPosition >
      sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge) &&
    pageVerticalPosition >= sea1Div.offsetLeft - robbyLeftEdge &&
    pageVerticalPosition <=
      sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge &&
    ((isRobbySwimming = !0),
    shiftUpLayerHorizontal(),
    shiftRobbyToSeaFloor(),
    createBubble()),
    previousPageVerticalPosition >= sea1Div.offsetLeft - robbyLeftEdge &&
      previousPageVerticalPosition <=
        sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge &&
      (pageVerticalPosition < sea1Div.offsetLeft - robbyLeftEdge ||
        pageVerticalPosition >
          sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge) &&
      ((isRobbySwimming = !1),
      shiftDownLayerHorizontal(),
      shiftRobbyToGroundLevel(),
      clearInterval(bubbleTimer),
      clearInterval(blinkSeaAnimalsTimer));
}

function shiftUpDownHorizontalLayersOnResize() {
  pageVerticalPosition >= sea1Div.offsetLeft - robbyLeftEdge &&
    pageVerticalPosition <=
      sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge &&
    (clearInterval(shiftUpLayerHorizontalTimer),
    clearInterval(shiftDownLayerHorizontalTimer),
    (isRobbySwimming = !0),
    positionLayerHorizontalToTop(),
    positionVerticalLayersBottomToHorizontalLayersBottom(),
    createBubble()),
    (pageVerticalPosition < sea1Div.offsetLeft - robbyLeftEdge ||
      pageVerticalPosition >
        sea1Div.offsetLeft + sea1Div.offsetWidth - robbyRightEdge) &&
      (clearInterval(shiftUpLayerHorizontalTimer),
      clearInterval(shiftDownLayerHorizontalTimer),
      (isRobbySwimming = !1),
      "horizontal" == layersMovement
        ? (positionLayerHorizontalToBottom(),
          positionVerticalLayersBottomToHorizontalLayersBottom())
        : (positionHorizontalLayersAtBottomMost(),
          positionHorizontalLayersToHaveSameRightPosition()),
      clearInterval(bubbleTimer),
      clearInterval(blinkSeaAnimalsTimer));
}

function setShiftUpLayerHorizontalDistance() {
  shiftUpLayerHorizontalDistance = 0.75 * containerDiv.offsetHeight;
}

function shiftUpLayerHorizontal() {
  setShiftUpLayerHorizontalDistance(),
    clearShiftUpDownLayerHorizontalTimer(),
    (shiftUpLayerHorizontalTimer = setInterval(function () {
      moveUpLayerHorizontal();
    }, shiftUpDownLayerHorizontalInterval)),
    disableIsRobbyJumpingAndFalling();
}

function moveUpLayerHorizontal() {
  if ("horizontal" == layersMovement) {
    for (var e = 0; e < layerHorizontalArray.length; e++) {
      var t =
        layerHorizontalArray[e].offsetTop - shiftUpDownLayerHorizontalIncrement;
      t <= -shiftUpLayerHorizontalDistance
        ? ((t = -shiftUpLayerHorizontalDistance),
          (layerHorizontalArray[e].style.top = t + "px"),
          clearInterval(shiftUpLayerHorizontalTimer))
        : (layerHorizontalArray[e].style.top = t + "px"),
        robbyContainerDiv.offsetTop >
          sea1Div.offsetTop +
            layerHorizontalArray[layerHorizontalArray.length - 1].offsetTop &&
          (isRobbyBelowSeaLevel = !0);
    }
    positionVerticalLayersBottomToHorizontalLayersBottom();
  } else
    clearInterval(shiftUpLayerHorizontalTimer),
      positionHorizontalLayersAtBottomMost(),
      positionHorizontalLayersToHaveSameRightPosition(),
      (isRobbyBelowSeaLevel = !1);
}

function shiftDownLayerHorizontal() {
  clearShiftUpDownLayerHorizontalTimer(),
    (shiftDownLayerHorizontalTimer = setInterval(function () {
      moveDownLayerHorizontal();
    }, shiftUpDownLayerHorizontalInterval));
}

function moveDownLayerHorizontal() {
  if ("horizontal" == layersMovement) {
    for (var e = 0; e < layerHorizontalArray.length; e++) {
      var t =
        layerHorizontalArray[e].offsetTop + shiftUpDownLayerHorizontalIncrement;
      0 <= t
        ? ((t = 0),
          (layerHorizontalArray[e].style.top = t + "px"),
          clearInterval(shiftDownLayerHorizontalTimer))
        : (layerHorizontalArray[e].style.top = t + "px"),
        robbyContainerDiv.offsetTop <
          sea1Div.offsetTop +
            layerHorizontalArray[layerHorizontalArray.length - 1].offsetTop &&
          (isRobbyBelowSeaLevel = !1);
    }
    positionVerticalLayersBottomToHorizontalLayersBottom();
  } else
    clearInterval(shiftDownLayerHorizontalTimer),
      positionHorizontalLayersAtBottomMost(),
      positionHorizontalLayersToHaveSameRightPosition(),
      (isRobbyBelowSeaLevel = !1);
}

function clearShiftUpDownLayerHorizontalTimer() {
  clearInterval(shiftUpLayerHorizontalTimer),
    clearInterval(shiftDownLayerHorizontalTimer);
}

function shiftRobbyToGroundLevel() {
  $(robbyContainerDiv)
    .stop()
    .animate(
      {
        bottom:
          containerDiv.offsetHeight -
          groundAndGrassContainer1Div.offsetTop +
          "px",
      },
      300,
      function () {}
    );
}

function shiftRobbyToSeaFloor() {
  $(robbyContainerDiv)
    .stop()
    .animate(
      {
        bottom: seaFloorDiv.offsetHeight + "px",
      },
      300,
      function () {}
    );
}

function positionLayerHorizontalToTop() {
  if (1 == isRobbySwimming) {
    setShiftUpLayerHorizontalDistance();
    for (var e = 0; e < layerHorizontalArray.length; e++)
      layerHorizontalArray[e].style.top =
        -shiftUpLayerHorizontalDistance + "px";
    for (e = 0; e < layerVerticalArray.length; e++)
      layerVerticalArray[e].style.bottom =
        shiftUpLayerHorizontalDistance + "px";
  }
}

function positionLayerHorizontalToBottom() {
  if (0 == isRobbySwimming) {
    for (var e = 0; e < layerHorizontalArray.length; e++)
      layerHorizontalArray[e].style.top = "0px";
    for (e = 0; e < layerVerticalArray.length; e++)
      layerVerticalArray[e].style.bottom = "0px";
  }
}

function checkRobbyJumpFallSwim() {
  if ("horizontal" == layersMovement)
    if (1 == isRobbySwimming) 1 == isRobbyBelowSeaLevel && robbySwimUp();
    else
      for (var e = 0; e < elevationArray.length; e++)
        robbyJumpUp(e), robbyFall(e);
}

function robbyJumpUp(e) {
  ((previousPageVerticalPosition <=
    elevationArray[e].offsetLeft - robbyRightEdge &&
    pageVerticalPosition > elevationArray[e].offsetLeft - robbyRightEdge) ||
    (previousPageVerticalPosition >=
      elevationArray[e].offsetLeft +
        elevationArray[e].offsetWidth -
        robbyLeftEdge &&
      pageVerticalPosition <
        elevationArray[e].offsetLeft +
          elevationArray[e].offsetWidth -
          robbyLeftEdge)) &&
    (positionRobbyAtGroundLevel(),
    $(robbyContainerDiv)
      .stop()
      .animate(
        {
          bottom: [
            containerDiv.offsetHeight -
              groundAndGrassContainer1Div.offsetTop +
              300,
            "easeOutCubic",
          ],
        },
        300,
        function () {
          robbyJumpDown(e);
        }
      ),
    setRobbyJumpUpFrame());
}

function robbyJumpDown(e) {
  pageVerticalPosition > elevationArray[e].offsetLeft - robbyRightEdge &&
    pageVerticalPosition <
      elevationArray[e].offsetLeft +
        elevationArray[e].offsetWidth -
        robbyLeftEdge &&
    ($(robbyContainerDiv)
      .stop()
      .animate(
        {
          bottom: [
            containerDiv.offsetHeight - elevationArray[e].offsetTop,
            "easeInCubic",
          ],
        },
        300,
        function () {
          disableIsRobbyJumpingAndFalling(), setRobbyStaticFrame();
        }
      ),
    setRobbyJumpDownAndFallFrame());
}

function robbyFall(e) {
  ((previousPageVerticalPosition <
    elevationArray[e].offsetLeft +
      elevationArray[e].offsetWidth -
      robbyLeftEdge &&
    pageVerticalPosition >=
      elevationArray[e].offsetLeft +
        elevationArray[e].offsetWidth -
        robbyLeftEdge) ||
    (previousPageVerticalPosition >
      elevationArray[e].offsetLeft - robbyRightEdge &&
      pageVerticalPosition <= elevationArray[e].offsetLeft - robbyRightEdge)) &&
    ((isRobbyFalling = !0),
    setRobbyJumpDownAndFallFrame(),
    $(robbyContainerDiv)
      .stop()
      .animate(
        {
          bottom: [
            containerDiv.offsetHeight - groundAndGrassContainer1Div.offsetTop,
            "easeInCubic",
          ],
        },
        300,
        function () {
          disableIsRobbyJumpingAndFalling(), setRobbyStaticFrame();
        }
      ));
}

function setRobbyJumpUpFrame() {
  clearShiftRobbyFrameTimer(),
    (isRobbyJumping = !0),
    (robbyFramesDiv.style.left =
      -1 * robbyStartJumpFrame * robbyOneFrameWidth + "px");
}

function setRobbyJumpDownAndFallFrame() {
  robbyFramesDiv.style.left =
    -1 * robbyStopJumpFrame * robbyOneFrameWidth + "px";
}

function setRobbyStaticFrame() {
  robbyFramesDiv.style.left = "0px";
}

function disableIsRobbyJumpingAndFalling() {
  isRobbyFalling = isRobbyJumping = !1;
}

function robbySwimUp() {
  if ((getSwimUpHeight(), 0 < swimUpHeight)) {
    var e = seaFloorDiv.offsetHeight + swimUpHeight + "px",
      t = 3 * swimUpHeight,
      i = 6 * swimUpHeight;
    $(robbyContainerDiv)
      .stop()
      .animate(
        {
          bottom: e,
        },
        t,
        function () {
          robbySwimDown(i);
        }
      );
  }
}

function robbySwimDown(e) {
  $(robbyContainerDiv)
    .stop()
    .animate(
      {
        bottom: seaFloorDiv.offsetHeight + "px",
      },
      e,
      function () {
        setRobbyStaticFrame();
      }
    ),
    robbyContainerDiv.offsetTop + robbyContainerDiv.offsetHeight <=
    containerDiv.offsetHeight -
      seaFloorDiv.offsetHeight -
      minimumVerticalDistanceToTriggerRobbySwimDownFrame
      ? (robbyFramesDiv.style.left =
          -1 * robbySwimDownFrame * robbyOneFrameWidth + "px")
      : setRobbyStaticFrame();
}

function animateRobbyEyes() {
  clearInterval(blinkRobbyEyesTimer),
    (blinkRobbyEyesTimer = setInterval(function () {
      blinkRobbyEyes();
    }, 4e3));
}

function blinkRobbyEyes() {
  "not moving 2" != layersMovement &&
    ($(robbyEyesCloseDiv).fadeTo(0, 1),
    $(robbyEyesCloseDiv)
      .stop()
      .delay(300)
      .animate(
        {
          opacity: 0,
        },
        0,
        function () {}
      ));
}

function hideRobbyEyesClose() {
  $(robbyEyesCloseDiv).fadeTo(0, 0);
}

function getSwimUpHeight() {
  swimUpHeight = Math.abs(deltaPageVerticalPosition);
  var e = sea1Div.offsetHeight - robbyDiv.offsetHeight;
  e < swimUpHeight && (swimUpHeight = e);
}

function positionVerticalLayersHorizontally() {
  for (var e = 0; e < layerVerticalArray.length; e++)
    layerVerticalArray[e].style.left =
      layerHorizontalArray[e].offsetLeft +
      layerHorizontalArray[e].offsetWidth -
      containerDiv.offsetWidth +
      "px";
}

function positionBalloonAndRobbyContainerHorizontally() {
  var e =
    pageVerticalPosition *
      layerHorizontalSpeedArray[layerHorizontalSpeedArray.length - 1] -
    (layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
      containerDiv.offsetWidth);
  robbyMaxHorizontalDistance = 0.5 * containerDiv.offsetWidth + 250;
  var t = 0.5 * containerDiv.offsetWidth + e;
  robbyMaxHorizontalDistance <= t && (t = robbyMaxHorizontalDistance);
  var i = 0.5 * containerDiv.offsetWidth + 50,
    n = 0.5 * (containerDiv.offsetWidth - balloonDiv.offsetWidth) + e;
  i <= n && (n = i),
    "vertical" == layersMovement
      ? ((balloonDiv.style.left = n + "px"),
        (robbyContainerDiv.style.left = t + "px"))
      : "not moving 1" == layersMovement || "not moving 2" == layersMovement
      ? ((robbyContainerDiv.style.left =
          t +
          pageVerticalPosition -
          (pageDiv.offsetHeight -
            containerDiv.offsetHeight -
            distanceBetweenRobbyAndBalloon) +
          "px"),
        (balloonDiv.style.left = n + "px"))
      : ((balloonDiv.style.left =
          layerHorizontalArray[layerHorizontalArray.length - 1].offsetLeft +
          layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
          0.5 * (containerDiv.offsetWidth + balloonDiv.offsetWidth) +
          "px"),
        (robbyContainerDiv.style.left = "50%"));
}

function positionBalloonVertically() {
  balloonDiv.style.bottom = 0.2 * containerDiv.offsetHeight + "px";
}

function setLayersMovement() {
  layersMovement =
    pageVerticalPosition *
      layerHorizontalSpeedArray[layerHorizontalSpeedArray.length - 1] <=
    layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth -
      containerDiv.offsetWidth
      ? "horizontal"
      : pageVerticalPosition >=
          pageDiv.offsetHeight -
            containerDiv.offsetHeight -
            distanceBetweenRobbyAndBalloon &&
        pageVerticalPosition < pageDiv.offsetHeight - containerDiv.offsetHeight
      ? "not moving 1"
      : pageVerticalPosition >= pageDiv.offsetHeight - containerDiv.offsetHeight
      ? "not moving 2"
      : "vertical";
}

function orientRobby() {
  0 < deltaPageVerticalPosition &&
    ((robbyFramesDiv.style.top = "0px"),
    (robbyEyesCloseDiv.style.left = "90px")),
    deltaPageVerticalPosition < 0 &&
      ((robbyFramesDiv.style.top = "-200px"),
      (robbyEyesCloseDiv.style.left = "55px"));
}

function storeDivs() {
  for (var e = document.getElementsByTagName("div"), t = 0; t < e.length; t++)
    "fish" == e[t].getAttribute("class") && fishArray.push(e[t]),
      "fish-eyes" == e[t].getAttribute("class") && fishEyeArray.push(e[t]),
      "crab" == e[t].getAttribute("class") && crabArray.push(e[t]),
      "crab-eyes" == e[t].getAttribute("class") && crabEyeArray.push(e[t]),
      "turtle" == e[t].getAttribute("class") && turtleArray.push(e[t]),
      "turtle-eyes" == e[t].getAttribute("class") && turtleEyeArray.push(e[t]),
      ("nba-board-blue" == e[t].getAttribute("class") ||
        "nba-board-red" == e[t].getAttribute("class")) &&
        nbaBoardArray.push(e[t]),
      "elevation" == e[t].getAttribute("class") && elevationArray.push(e[t]),
      "plant" == e[t].getAttribute("class") && plantArray.push(e[t]),
      "building" == e[t].getAttribute("class") && buildingArray.push(e[t]),
      ("building-enemy-face-a-eyes" == e[t].getAttribute("class") ||
        "building-enemy-face-b-eyes" == e[t].getAttribute("class")) &&
        buildingEnemyFaceEyeArray.push(e[t]),
      ("building-leg-frame-a" == e[t].getAttribute("class") ||
        "building-leg-frame-b" == e[t].getAttribute("class")) &&
        buildingLegFrameArray.push(e[t]),
      ("building-leg-container-a" == e[t].getAttribute("class") ||
        "building-leg-container-b" == e[t].getAttribute("class")) &&
        buildingLegContainerArray.push(e[t]),
      "contact-confirmation-container" == e[t].getAttribute("class") &&
        contactConfirmationContainerArray.push(e[t]),
      "experience-text-container" == e[t].getAttribute("class") &&
        experienceTextContainerArray.push(e[t]),
      "chain-block-and-string-container" == e[t].getAttribute("class") &&
        chainBlockAndStringContainerArray.push(e[t]),
      "layer-horizontal" == e[t].getAttribute("class") &&
        layerHorizontalArray.push(e[t]),
      "layer-vertical" == e[t].getAttribute("class") &&
        layerVerticalArray.push(e[t]),
      ("algae-a" == e[t].getAttribute("class") ||
        "algae-b" == e[t].getAttribute("class") ||
        "title-skills-class" == e[t].getAttribute("class")) &&
        seaFloorFrontObjectArray.push(e[t]),
      ("coral" == e[t].getAttribute("class") ||
        "coral-big" == e[t].getAttribute("class")) &&
        seaFloorBackObjectArray.push(e[t]),
      "squid-hand-close" == e[t].getAttribute("class") &&
        squidHandCloseArray.push(e[t]),
      "squid-hand-open" == e[t].getAttribute("class") &&
        squidHandOpenArray.push(e[t]),
      "firework" == e[t].getAttribute("class") && fireworkArray.push(e[t]);
}

function animatePlants() {
  for (var e = 0; e < plantArray.length; e++)
    $(plantArray[e])
      .stop()
      .delay(300 * e)
      .animate(
        {
          top: [plantTargetTopObjectArray[e].offsetTop, "easeOutElastic"],
        },
        800,
        function () {}
      );
}

function positionPlants() {
  for (var e = 0; e < plantArray.length; e++)
    plantArray[e].style.top =
      1 == canAnimatePlantInformation
        ? "100%"
        : plantTargetTopObjectArray[e].offsetTop + "px";
}

function animateBuildings() {
  clearInterval(buildingLegsTimer),
    (buildingLegsTimer = setInterval(function () {
      animateBuildingsLegs();
    }, 200));
  for (var e = 0; e < buildingArray.length; e++)
    $(buildingArray[e])
      .stop()
      .delay(300 * e)
      .animate(
        {
          left: [buildingTargetLeftArray[e], "easeOutCubic"],
        },
        1e3,
        function () {}
      );
}

function animateBuildingsLegs() {
  buildingCounter += 1;
  for (var e = 0; e < buildingArray.length; e++) {
    if (
      buildingArray[buildingArray.length - 1].offsetLeft ==
      buildingTargetLeftArray[buildingTargetLeftArray.length - 1]
    )
      return (
        (buildingLegFrameArray[buildingLegFrameArray.length - 1].style.left =
          "0px"),
        clearInterval(buildingLegsTimer),
        void (buildingCounter = 0)
      );
    buildingArray[e].offsetLeft > buildingTargetLeftArray[e] &&
    buildingArray[e].offsetLeft < buildingEarlyPositionArray[e]
      ? (buildingLegFrameArray[e].style.left =
          -1 *
            buildingLegContainerArray[e].offsetWidth *
            (buildingCounter % 2) +
          "px")
      : (buildingLegFrameArray[e].style.left = "0px");
  }
}

function animateBuildingsEyes() {
  clearInterval(buildingBlinkTimer),
    (buildingBlinkTimer = setInterval(function () {
      blinkBuildings();
    }, 4e3));
}

function blinkBuildings() {
  if (
    pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
      about2ContainerDiv.offsetLeft ||
    pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
      about2ContainerDiv.offsetLeft + about2ContainerDiv.offsetWidth
  )
    clearInterval(buildingBlinkTimer);
  else {
    var e = Math.floor(Math.random() * buildingArray.length);
    $(buildingEnemyFaceEyeArray[e]).fadeTo(0, 1),
      $(buildingEnemyFaceEyeArray[e])
        .stop()
        .delay(300)
        .animate(
          {
            opacity: 0,
          },
          0,
          function () {}
        );
  }
}

function positionBuildings() {
  for (var e = 0; e < buildingArray.length; e++)
    buildingArray[e].style.left = buildingEarlyPositionArray[e] + "px";
}

function nbaBoardsJump() {
  for (var e = 0; e < nbaBoardArray.length; e++)
    $(nbaBoardArray[e])
      .stop()
      .delay(100 * e)
      .animate(
        {
          bottom: [200, "easeOutCubic"],
        },
        300,
        function () {
          nbaBoardsFall();
        }
      );
}

function nbaBoardsFall() {
  $(nbaBoardArray[nbaBoardsCounter])
    .stop()
    .animate(
      {
        bottom: [0, "easeInCubic"],
      },
      300,
      function () {}
    ),
    (nbaBoardsCounter += 1) >= nbaBoardArray.length && (nbaBoardsCounter = 0);
}

function positionNbaBoard() {
  for (var e = 0; e < nbaBoardArray.length; e++)
    nbaBoardArray[e].style.bottom = "0px";
}

function animateNbaBoardsContinuously() {
  clearInterval(nbaBoardsAnimationTimer),
    (nbaBoardsAnimationTimer = setInterval(function () {
      nbaBoardsJump();
    }, 3e3));
}

function animateNbaPlayer() {
  nbaPlayerRun();
}

function nbaPlayerRun() {
  clearInterval(nbaPlayerTimer),
    (nbaPlayerTimer = setInterval(function () {
      animateNbaPlayerRun();
    }, 200)),
    $(nbaPlayerContainerDiv)
      .stop()
      .animate(
        {
          left: "690px",
        },
        1e3,
        function () {
          nbaPlayerJump();
        }
      );
}

function animateNbaPlayerRun() {
  shiftNbaPlayerFrame((nbaPlayerCounter += 1) % 2);
}

function nbaPlayerJump() {
  clearInterval(nbaPlayerTimer),
    (nbaPlayerCounter = 0),
    shiftNbaPlayerFrame(2),
    $(nbaPlayerContainerDiv)
      .stop()
      .animate(
        {
          left: "570px",
          bottom: [200, "easeOutCubic"],
        },
        300,
        function () {
          nbaPlayerFall();
        }
      );
}

function nbaPlayerFall() {
  shiftNbaPlayerFrame(3),
    shakeRim(),
    bounceBall(),
    nbaBoardsJump(),
    animateNbaBoardsContinuously(),
    $(nbaPlayerContainerDiv)
      .stop()
      .animate(
        {
          left: "450px",
          bottom: [0, "easeInCubic"],
        },
        300,
        function () {}
      );
}

function shiftNbaPlayerFrame(e) {
  nbaPlayerFrameDiv.style.left = -300 * e + "px";
}

function shakeRim() {
  $(nbaRimContainerDiv)
    .stop()
    .animate(
      {
        bottom: [-50, "easeOutCubic"],
      },
      100,
      function () {
        moveRimUp();
      }
    );
}

function moveRimUp() {
  $(nbaRimContainerDiv)
    .stop()
    .animate(
      {
        bottom: [0, "easeOutElastic"],
      },
      500,
      function () {}
    );
}

function bounceBall() {
  (nbaBallDiv.style.opacity = "1"),
    $(nbaBallDiv)
      .stop()
      .animate(
        {
          bottom: [0, "easeOutBounce"],
        },
        1200,
        function () {}
      );
}

function positionNbaElements() {
  stopAllNbaAnimation(),
    setAllNbaCounter(),
    clearAllNbaTimer(),
    positionNbaBoard(),
    positionNbaPlayerContainer(),
    hideNbaBall();
}

function positionNbaPlayerContainer() {
  (nbaPlayerContainerDiv.style.left = "1400px"),
    (nbaPlayerContainerDiv.style.bottom = "0px");
}

function hideNbaBall() {
  $(nbaBallDiv).fadeTo(0, 0),
    (nbaBallDiv.style.left = "415px"),
    (nbaBallDiv.style.bottom = "250px");
}

function animateNbaPlayerEyes() {
  clearInterval(blinkNbaPlayerTimer),
    (blinkNbaPlayerTimer = setInterval(function () {
      blinkNbaPlayer();
    }, 4e3));
}

function blinkNbaPlayer() {
  pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
    about3ContainerDiv.offsetLeft ||
  pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
    about3ContainerDiv.offsetLeft + about3ContainerDiv.offsetWidth
    ? clearInterval(blinkNbaPlayerTimer)
    : ($(nbaPlayerEyesDiv).fadeTo(0, 1),
      $(nbaPlayerEyesDiv)
        .stop()
        .delay(300)
        .animate(
          {
            opacity: 0,
          },
          0,
          function () {}
        ));
}

function clearAllNbaTimer() {
  clearInterval(blinkNbaPlayerTimer),
    clearInterval(nbaBoardsAnimationTimer),
    clearInterval(nbaPlayerTimer);
}

function setAllNbaCounter() {
  nbaPlayerCounter = nbaBoardsCounter = 0;
}

function stopAllNbaAnimation() {
  for (var e = 0; e < nbaBoardArray.length; e++)
    $(nbaBoardArray[e]).stop(!0, !1);
  $(nbaPlayerContainerDiv).stop(!0, !1);
}

function positionSeaAnimals(e, t, i, n) {
  for (var a = e, o = t, r = i, l = n, s = 0, c = 0; c < o.length; c++)
    for (var f = 0; f < o[c]; f++)
      (a[s].style.left = seaAnimalSwimDistance + f * r + "px"),
        (a[s].style.top = c * l + "px"),
        (s += 1);
}

function animateSeaAnimals(e) {
  var t = e;
  t == fishArray && (isFishStillAnimating = !0),
    t == crabArray && (isCrabStillAnimating = !0),
    t == turtleArray && (isTurtleStillAnimating = !0);
  for (var i = 0; i < t.length; i++)
    $(t[i])
      .stop()
      .delay(100 * i)
      .animate(
        {
          left: [t[i].offsetLeft - seaAnimalSwimDistance, "easeOutCubic"],
        },
        600,
        function () {
          disableIsSeaAnimalStillAnimating(t);
        }
      );
}

function disableIsSeaAnimalStillAnimating(e) {
  var t = e;
  t == fishArray &&
    (fishAnimateNumber >= t.length - 1
      ? ((isFishStillAnimating = !1), (fishAnimateNumber = 0))
      : (fishAnimateNumber += 1)),
    t == crabArray &&
      (crabAnimateNumber >= t.length - 1
        ? ((isCrabStillAnimating = !1), (crabAnimateNumber = 0))
        : (crabAnimateNumber += 1)),
    t == turtleArray &&
      (turtleAnimateNumber >= t.length - 1
        ? ((isTurtleStillAnimating = !1), (turtleAnimateNumber = 0))
        : (turtleAnimateNumber += 1));
}

function animateRobbyRunSwim() {
  1 == canAnimateRobbyRunSwim &&
    0 == isRobbyJumping &&
    0 == isRobbyFalling &&
    "vertical" != layersMovement &&
    (disableAnimateRobbyRunSwim(),
    clearInterval(shiftRobbyFrameTimer),
    (shiftRobbyFrameTimer = setInterval(function () {
      shiftRobbyFrame();
    }, shiftRobbyFrameTimeInterval)));
}

function shiftRobbyFrame() {
  if (1 == isRobbyFalling)
    return clearShiftRobbyFrameTimer(), void setRobbyJumpDownAndFallFrame();
  if (
    (1 == isRobbySwimming && 1 == isRobbyBelowSeaLevel
      ? ((robbyStartFrame = robbyStartSwimFrame),
        (robbyStopFrame = robbyStopSwimFrame))
      : ((robbyStartFrame = robbyStartRunFrame),
        (robbyStopFrame = robbyStopRunFrame)),
    (robbyFramesDiv.style.left =
      -1 * robbyOneFrameWidth * (robbyStartFrame + counter) + "px"),
    robbyStopFrame < robbyStartFrame + counter + switcher && (switcher *= -1),
    robbyStartFrame + counter + switcher == robbyStartFrame &&
      (pageVerticalPositionWhenAnimateRobby1 = pageVerticalPosition),
    robbyStartFrame + counter + switcher < robbyStartFrame)
  ) {
    if (
      pageVerticalPositionWhenAnimateRobby1 ==
      (pageVerticalPositionWhenAnimateRobby2 = pageVerticalPosition)
    )
      return (
        clearShiftRobbyFrameTimer(),
        void ("not moving 2" == layersMovement && robbyHandsUp())
      );
    switcher *= -1;
  }
  counter += switcher;
}

function clearShiftRobbyFrameTimer() {
  clearInterval(shiftRobbyFrameTimer),
    (0 == isRobbySwimming ||
      (1 == isRobbySwimming &&
        robbyContainerDiv.offsetTop + robbyContainerDiv.offsetHeight >=
          containerDiv.offsetHeight - seaFloorDiv.offsetHeight)) &&
      setRobbyStaticFrame(),
    (counter = 0),
    (switcher = 1),
    enableAnimateRobbyRunSwim();
}

function enableAnimateRobbyRunSwim() {
  canAnimateRobbyRunSwim = !0;
}

function disableAnimateRobbyRunSwim() {
  canAnimateRobbyRunSwim = !1;
}

function positionChainBlockAndStringContainer() {
  for (var e = 0; e < chainBlockAndStringContainerArray.length; e++)
    0 == e && (canAnimateBossInformation = canAnimateRobotInformation),
      1 == e && (canAnimateBossInformation = canAnimateSquidInformation),
      2 == e && (canAnimateBossInformation = canAnimateAlienInformation),
      (chainBlockAndStringContainerArray[e].style.left =
        0.5 * experienceTextContainerArray[e].offsetWidth -
        0.5 * chainBlockAndStringContainerArray[e].offsetWidth +
        "px"),
      (chainBlockAndStringContainerArray[e].style.bottom =
        1 == canAnimateBossInformation
          ? 0.8 * containerDiv.offsetHeight +
            experienceTextContainerArray[e].offsetHeight +
            "px"
          : experienceTextContainerDistanceFromFloor +
            experienceTextContainerArray[e].offsetHeight +
            "px");
}

function animateChainBlockAndStringContainer(e) {
  $(chainBlockAndStringContainerArray[e])
    .stop()
    .animate(
      {
        bottom: [
          experienceTextContainerDistanceFromFloor +
            experienceTextContainerArray[e].offsetHeight,
          "easeOutCubic",
        ],
      },
      1e3,
      function () {}
    );
}

function positionExperienceTextContainer() {
  for (var e = 0; e < experienceTextContainerArray.length; e++)
    0 == e && (canAnimateBossInformation = canAnimateRobotInformation),
      1 == e && (canAnimateBossInformation = canAnimateSquidInformation),
      2 == e && (canAnimateBossInformation = canAnimateAlienInformation),
      (experienceTextContainerArray[e].style.bottom =
        1 == canAnimateBossInformation
          ? 0.8 * containerDiv.offsetHeight + "px"
          : experienceTextContainerDistanceFromFloor + "px");
}

function animateExperienceTextContainer(e) {
  $(experienceTextContainerArray[e])
    .stop()
    .animate(
      {
        bottom: [experienceTextContainerDistanceFromFloor, "easeOutCubic"],
      },
      1e3,
      function () {}
    );
}

function positionExperience1Elements() {
  (robotDiv.style.left = experience1ContainerDiv.offsetWidth + "px"),
    $(piechartRobotTextGraphic1Div).fadeTo(0, 0),
    $(piechartRobotTextGraphic2Div).fadeTo(0, 0),
    $(piechartRobotTextAnimation1Div).fadeTo(0, 0),
    $(piechartRobotTextAnimation2Div).fadeTo(0, 0),
    $(piechartRobotTextCode1Div).fadeTo(0, 0),
    $(piechartRobotTextCode2Div).fadeTo(0, 0),
    ("internet explorer" == browserName && browserVersion <= 8) ||
      $(piechartRobotFrontDiv).fadeTo(0, 0);
}

function positionExperience2Elements() {
  (squidDiv.style.left = experience2ContainerDiv.offsetWidth + "px"),
    $(piechartSquidTextGraphic1Div).fadeTo(0, 0),
    $(piechartSquidTextGraphic2Div).fadeTo(0, 0),
    $(piechartSquidTextAnimation1Div).fadeTo(0, 0),
    $(piechartSquidTextAnimation2Div).fadeTo(0, 0),
    $(piechartSquidTextCode1Div).fadeTo(0, 0),
    $(piechartSquidTextCode2Div).fadeTo(0, 0),
    ("internet explorer" == browserName && browserVersion <= 8) ||
      $(piechartSquidFrontDiv).fadeTo(0, 0);
}

function positionExperience3Elements() {
  (alienDiv.style.left = experience3ContainerDiv.offsetWidth + "px"),
    $(piechartAlienTextGraphic1Div).fadeTo(0, 0),
    $(piechartAlienTextGraphic2Div).fadeTo(0, 0),
    $(piechartAlienTextAnimation1Div).fadeTo(0, 0),
    $(piechartAlienTextAnimation2Div).fadeTo(0, 0),
    $(piechartAlienTextCode1Div).fadeTo(0, 0),
    $(piechartAlienTextCode2Div).fadeTo(0, 0),
    ("internet explorer" == browserName && browserVersion <= 8) ||
      $(piechartAlienFrontDiv).fadeTo(0, 0);
}

function animateInformationAndEnemiesElements() {
  if ("horizontal" == layersMovement) {
    if (0 == isRobbySwimming)
      for (var e = 0; e < landInformationContainerArray.length; e++)
        (previousPageVerticalPosition + 0.5 * containerDiv.offsetWidth <
          landInformationContainerArray[e].offsetLeft ||
          previousPageVerticalPosition + 0.5 * containerDiv.offsetWidth >
            landInformationContainerArray[e].offsetLeft +
              landInformationContainerArray[e].offsetWidth) &&
          pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
            landInformationContainerArray[e].offsetLeft &&
          pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
            landInformationContainerArray[e].offsetLeft +
              landInformationContainerArray[e].offsetWidth &&
          (landInformationContainerArray[e] == about1ContainerDiv &&
            1 == canAnimatePlantInformation &&
            (animatePlants(), (canAnimatePlantInformation = !1)),
          landInformationContainerArray[e] == about2ContainerDiv &&
            (animateBuildingsEyes(),
            1 == canAnimateBuildingInformation &&
              (animateBuildings(), (canAnimateBuildingInformation = !1))),
          landInformationContainerArray[e] == about3ContainerDiv &&
            (animateNbaPlayerEyes(),
            1 == canAnimateNbaInformation &&
              (animateNbaPlayer(), (canAnimateNbaInformation = !1))),
          landInformationContainerArray[e] == experience1ContainerDiv &&
            (0 == canAnimateRobotInformation
              ? animateRobotHands()
              : (animateRobot(),
                animateExperienceTextContainer(0),
                animateChainBlockAndStringContainer(0),
                (canAnimateRobotInformation = !1))),
          landInformationContainerArray[e] == experience2ContainerDiv &&
            (0 == canAnimateSquidInformation
              ? animateSquidHands()
              : (animateSquid(),
                animateExperienceTextContainer(1),
                animateChainBlockAndStringContainer(1),
                (canAnimateSquidInformation = !1))),
          landInformationContainerArray[e] == experience3ContainerDiv &&
            (0 == canAnimateAlienInformation
              ? animateAlienHand()
              : (animateAlien(),
                animateExperienceTextContainer(2),
                animateChainBlockAndStringContainer(2),
                (canAnimateAlienInformation = !1))));
    if (1 == isRobbySwimming)
      for (e = 0; e < seaInformationContainerArray.length; e++)
        (previousPageVerticalPosition + 0.5 * containerDiv.offsetWidth <
          sea1Div.offsetLeft + seaInformationContainerArray[e].offsetLeft ||
          previousPageVerticalPosition + 0.5 * containerDiv.offsetWidth >
            sea1Div.offsetLeft +
              seaInformationContainerArray[e].offsetLeft +
              seaInformationContainerArray[e].offsetWidth) &&
          pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
            sea1Div.offsetLeft + seaInformationContainerArray[e].offsetLeft &&
          pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
            sea1Div.offsetLeft +
              seaInformationContainerArray[e].offsetLeft +
              seaInformationContainerArray[e].offsetWidth &&
          (seaInformationContainerArray[e] == skill1ContainerDiv &&
            (makeSeaAnimalsBlinking(fishEyeArray),
            1 == canAnimateFishInformation &&
              (animateSeaAnimals(fishArray), (canAnimateFishInformation = !1))),
          seaInformationContainerArray[e] == skill2ContainerDiv &&
            (makeSeaAnimalsBlinking(crabEyeArray),
            1 == canAnimateCrabInformation &&
              (animateSeaAnimals(crabArray), (canAnimateCrabInformation = !1))),
          seaInformationContainerArray[e] == skill3ContainerDiv &&
            (makeSeaAnimalsBlinking(turtleEyeArray),
            1 == canAnimateTurtleInformation &&
              (animateSeaAnimals(turtleArray),
              (canAnimateTurtleInformation = !1))));
  }
}

function animateRobot() {
  $(robotDiv)
    .stop()
    .animate(
      {
        left: "420px",
      },
      1e3,
      function () {
        animatePiechartAolFront(), animateRobotHands();
      }
    );
}

function animateRobotHands() {
  spinRobotHands(),
    clearInterval(animateRobotHandsTimer),
    (animateRobotHandsTimer = setInterval(function () {
      spinRobotHands();
    }, 4e3));
}

function spinRobotHands() {
  clearInterval(spinRobotHandsTimer),
    (spinRobotHandsTimer = setInterval(function () {
      changeRobotHands();
    }, 100));
}

function changeRobotHands() {
  if (robotHandChildrenLength <= changeRobotHandsCounter)
    (changeRobotHandsCounter = 0),
      clearInterval(spinRobotHandsTimer),
      setRobotHandsToDefault(),
      (pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
        experience1ContainerDiv.offsetLeft ||
        pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
          experience1ContainerDiv.offsetLeft +
            experience1ContainerDiv.offsetWidth) &&
        clearInterval(animateRobotHandsTimer);
  else
    for (var e = 0; e < robotHandChildrenLength; e++)
      e == changeRobotHandsCounter
        ? setRobotHandsToOpaque(e)
        : setRobotHandsToTransparent(e);
  changeRobotHandsCounter += 1;
}

function setRobotHandsToDefault() {
  for (var e = 0; e < robotHandChildrenLength; e++)
    0 == e ? setRobotHandsToOpaque(e) : setRobotHandsToTransparent(e);
}

function setRobotHandsToOpaque(e) {
  (robotHandLeftDiv.children[e].style.opacity = 1),
    (robotHandLeftDiv.children[e].style.filter = "alpha(opacity=100)"),
    (robotHandRightDiv.children[e].style.opacity = 1),
    (robotHandRightDiv.children[e].style.filter = "alpha(opacity=100)");
}

function setRobotHandsToTransparent(e) {
  (robotHandLeftDiv.children[e].style.opacity = 0),
    (robotHandLeftDiv.children[e].style.filter = "alpha(opacity=0)"),
    (robotHandRightDiv.children[e].style.opacity = 0),
    (robotHandRightDiv.children[e].style.filter = "alpha(opacity=0)");
}

function animateSquid() {
  $(squidDiv)
    .stop()
    .animate(
      {
        left: "430px",
      },
      1e3,
      function () {
        animatePiechartIncognitoFront(), animateSquidHands();
      }
    );
}

function animateSquidHands() {
  moveSquidHands(),
    clearInterval(animateSquidHandsTimer),
    (animateSquidHandsTimer = setInterval(function () {
      moveSquidHands();
    }, 4e3));
}

function moveSquidHands() {
  clearInterval(moveSquidHandsTimer),
    (moveSquidHandsTimer = setInterval(function () {
      openAndCloseSquidHands();
    }, 200));
}

function openAndCloseSquidHands() {
  8 <= openAndCloseSquidHandsCounter
    ? ((openAndCloseSquidHandsCounter = 0),
      clearInterval(moveSquidHandsTimer),
      openSquidHands(),
      (pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
        experience2ContainerDiv.offsetLeft ||
        pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
          experience2ContainerDiv.offsetLeft +
            experience2ContainerDiv.offsetWidth) &&
        clearInterval(animateSquidHandsTimer))
    : openAndCloseSquidHandsCounter % 2 == 0
    ? openSquidHands()
    : closeSquidHands(),
    (openAndCloseSquidHandsCounter += 1);
}

function openSquidHands() {
  for (var e = 0; e < squidHandOpenArray.length; e++)
    (squidHandOpenArray[e].style.opacity = 1),
      (squidHandOpenArray[e].style.filter = "alpha(opacity=100)");
  for (e = 0; e < squidHandCloseArray.length; e++)
    (squidHandCloseArray[e].style.opacity = 0),
      (squidHandCloseArray[e].style.filter = "alpha(opacity=0)");
}

function closeSquidHands() {
  for (var e = 0; e < squidHandOpenArray.length; e++)
    (squidHandOpenArray[e].style.opacity = 0),
      (squidHandOpenArray[e].style.filter = "alpha(opacity=0)");
  for (e = 0; e < squidHandCloseArray.length; e++)
    (squidHandCloseArray[e].style.opacity = 1),
      (squidHandCloseArray[e].style.filter = "alpha(opacity=100)");
}

function animateAlienHand() {
  clearInterval(animateAlienHandsTimer),
    (animateAlienHandsTimer = setInterval(function () {
      rotateAlienHands();
    }, 100));
}

function rotateAlienHands() {
  (alienSteerPreviousAngle = alienSteerAngle) <
  (alienSteerAngle += alienSteerAngleIncrement)
    ? alienSteerAngleLimit < alienSteerAngle &&
      ((alienSteerAngleIncrement *= -1), (alienSteerAngleLimit *= -1))
    : alienSteerAngle < alienSteerAngleLimit &&
      ((alienSteerAngleIncrement *= -1), (alienSteerAngleLimit *= -1)),
    0 == alienSteerAngle &&
    (pageVerticalPosition + 0.5 * containerDiv.offsetWidth <
      experience3ContainerDiv.offsetLeft ||
      pageVerticalPosition + 0.5 * containerDiv.offsetWidth >
        experience3ContainerDiv.offsetLeft +
          experience3ContainerDiv.offsetWidth)
      ? (clearInterval(animateAlienHandsTimer),
        (alienSteerDiv.style.webkitTransform = "rotate(0deg)"),
        (alienSteerDiv.style.MozTransform = "rotate(0deg)"),
        (alienSteerDiv.style.OTransform = "rotate(0deg)"),
        (alienSteerDiv.style.msTransform = "rotate(0deg)"),
        (alienSteerDiv.style.transform = "rotate(0deg)"))
      : ((alienSteerDiv.style.webkitTransform =
          "rotate(" + alienSteerAngle + "deg)"),
        (alienSteerDiv.style.MozTransform =
          "rotate(" + alienSteerAngle + "deg)"),
        (alienSteerDiv.style.OTransform = "rotate(" + alienSteerAngle + "deg)"),
        (alienSteerDiv.style.msTransform =
          "rotate(" + alienSteerAngle + "deg)"),
        (alienSteerDiv.style.transform = "rotate(" + alienSteerAngle + "deg)"));
}

function animateAlien() {
  $(alienDiv)
    .stop()
    .animate(
      {
        left: "450px",
      },
      1e3,
      function () {
        animatePiechartFoxnewsFront(), animateAlienHand();
      }
    );
}

function animatePiechartAolFront() {
  "internet explorer" == browserName && browserVersion <= 8
    ? animatePiechartAolText()
    : $(piechartRobotFrontDiv)
        .stop()
        .animate(
          {
            opacity: 1,
          },
          500,
          function () {
            animatePiechartAolText();
          }
        );
}

function animatePiechartIncognitoFront() {
  "internet explorer" == browserName && browserVersion <= 8
    ? animatePiechartIncognitoText()
    : $(piechartSquidFrontDiv)
        .stop()
        .animate(
          {
            opacity: 1,
          },
          500,
          function () {
            animatePiechartIncognitoText();
          }
        );
}

function animatePiechartFoxnewsFront() {
  "internet explorer" == browserName && browserVersion <= 8
    ? animatePiechartFoxnewsText()
    : $(piechartAlienFrontDiv)
        .stop()
        .animate(
          {
            opacity: 1,
          },
          500,
          function () {
            animatePiechartFoxnewsText();
          }
        );
}

function animatePiechartAolText() {
  animatePiechartAolTextCode(),
    animatePiechartAolTextGraphic(),
    animatePiechartAolTextAnimation();
}

function animatePiechartAolTextCode() {
  $(piechartRobotTextCode1Div)
    .stop()
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartRobotTextCode2Div)
      .stop()
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartAolTextGraphic() {
  $(piechartRobotTextGraphic1Div)
    .stop()
    .delay(300)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartRobotTextGraphic2Div)
      .stop()
      .delay(300)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartAolTextAnimation() {
  $(piechartRobotTextAnimation1Div)
    .stop()
    .delay(600)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartRobotTextAnimation2Div)
      .stop()
      .delay(600)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartIncognitoText() {
  animatePiechartIncognitoTextCode(),
    animatePiechartIncognitoTextAnimation(),
    animatePiechartIncognitoTextGraphic();
}

function animatePiechartIncognitoTextCode() {
  $(piechartSquidTextCode1Div)
    .stop()
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartSquidTextCode2Div)
      .stop()
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartIncognitoTextAnimation() {
  $(piechartSquidTextAnimation1Div)
    .stop()
    .delay(300)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartSquidTextAnimation2Div)
      .stop()
      .delay(300)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartIncognitoTextGraphic() {
  $(piechartSquidTextGraphic1Div)
    .stop()
    .delay(600)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartSquidTextGraphic2Div)
      .stop()
      .delay(600)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartFoxnewsText() {
  animatePiechartFoxnewsTextGraphic(),
    animatePiechartFoxnewsTextAnimation(),
    animatePiechartFoxnewsTextCode();
}

function animatePiechartFoxnewsTextCode() {
  $(piechartAlienTextCode1Div)
    .stop()
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartAlienTextCode2Div)
      .stop()
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartFoxnewsTextAnimation() {
  $(piechartAlienTextAnimation1Div)
    .stop()
    .delay(300)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartAlienTextAnimation2Div)
      .stop()
      .delay(300)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function animatePiechartFoxnewsTextGraphic() {
  $(piechartAlienTextGraphic1Div)
    .stop()
    .delay(600)
    .animate(
      {
        opacity: 1,
      },
      1e3,
      function () {}
    ),
    $(piechartAlienTextGraphic2Div)
      .stop()
      .delay(600)
      .animate(
        {
          opacity: 1,
        },
        1e3,
        function () {}
      );
}

function createBubble() {
  clearInterval(bubbleTimer),
    (bubbleTimer = setInterval(function () {
      animateBubble();
    }, 3e3));
}

function animateBubble() {
  var e =
    robbyContainerDiv.offsetTop -
    (sea1Div.offsetTop - shiftUpLayerHorizontalDistance);
  positionBubble(e),
    showBubble(),
    $(bubbleDiv)
      .stop()
      .animate(
        {
          top: "0px",
        },
        2 * e,
        function () {
          hideBubble();
        }
      );
}

function hideBubble() {
  $(bubbleDiv).fadeTo(0, 0);
}

function showBubble() {
  $(bubbleDiv).fadeTo(0, 1);
}

function positionBubble(e) {
  (bubbleDiv.style.left =
    pageVerticalPosition +
    0.5 * containerDiv.offsetWidth -
    sea1Div.offsetLeft +
    "px"),
    (bubbleDiv.style.top = e + "px");
}

function blinkSeaAnimals(e) {
  for (
    var t = e, i = new Array(), n = Math.ceil(5 * Math.random()), a = 0;
    a < n;
    a++
  ) {
    var o = Math.floor(Math.random() * e.length);
    i.push(t[o]);
  }
  for (a = 0; a < i.length; a++)
    $(i[a]).fadeTo(0, 1),
      $(i[a])
        .stop()
        .delay(300)
        .animate(
          {
            opacity: 0,
          },
          0,
          function () {}
        );
}

function makeSeaAnimalsBlinking(e) {
  clearInterval(blinkSeaAnimalsTimer),
    (blinkSeaAnimalsTimer = setInterval(function () {
      blinkSeaAnimals(e);
    }, 3e3));
}

function positionContactContainer() {
  (contactContainerDiv.style.top =
    layerVerticalArray[layerVerticalArray.length - 1].offsetTop + "px"),
    (contactContainerDiv.style.left =
      layerVerticalArray[layerVerticalArray.length - 1].offsetLeft + "px");
}

function positionFireworksContainer() {
  (fireworksContainerDiv.style.top =
    layerVerticalArray[layerVerticalArray.length - 1].offsetTop + "px"),
    (fireworksContainerDiv.style.left =
      layerVerticalArray[layerVerticalArray.length - 1].offsetLeft + "px");
}

function positionSocialContainer() {
  1 == canAnimateSocialContainer
    ? (setSocialContainerOpacity(0), (socialContainerDiv.style.top = "80%"))
    : (socialContainerDiv.style.top = "0px");
}

function animateSocialContainer() {
  1 == canAnimateSocialContainer &&
    ($(socialContainerDiv)
      .stop()
      .animate(
        {
          top: [0, "easeOutCubic"],
        },
        1e3,
        function () {}
      ),
    setSocialContainerOpacity(1),
    (canAnimateSocialContainer = !1));
}

function setSocialContainerOpacity(e) {
  1 < e && (e = 1), e < 0 && (e = 0);
  for (var t = $(socialContainerDiv).children().length, i = 0; i < t; i++)
    $(socialContainerDiv.children[i]).fadeTo(0, e);
  var n = $(socialContainerDiv.children[1]).children().length;
  for (i = 0; i < n; i++)
    $(socialContainerDiv.children[1].children[i]).fadeTo(0, e);
}

function happyRobby() {
  0 == isRobbyHappy &&
    (clearInterval(happyRobbyTimer),
    (happyRobbyTimer = setInterval(function () {
      robbyHandsUp();
    }, 3e3)),
    (isRobbyHappy = !0));
}

function clearHappyRobbyTimer() {
  1 == isRobbyHappy && (clearInterval(happyRobbyTimer), (isRobbyHappy = !1));
}

function robbyHandsUp() {
  (robbyFramesDiv.style.left = "-1600px"),
    setTimeout(function () {
      setRobbyStaticFrame();
    }, 1e3);
}

function positionSplashContainer() {
  splashContainerDiv.style.left =
    0.5 * (containerDiv.offsetWidth - splashContainerDiv.offsetWidth) + "px";
}

function positionRobbyContainerVertically() {
  1 == isPreloadShiftUpAnimationFinish &&
    ($(robbyContainerDiv).stop(!0, !1),
    setRobbyStaticFrame(),
    1 == isRobbySwimming
      ? positionRobbyAtSeaFloorLevel()
      : (checkElevationNumberBelowRobby(),
        null != elevationNumberBelowRobby
          ? (robbyContainerDiv.style.bottom =
              containerDiv.offsetHeight -
              elevationArray[elevationNumberBelowRobby].offsetTop +
              "px")
          : positionRobbyAtGroundLevel()));
}

function positionRobbyAtGroundLevel() {
  robbyContainerDiv.style.bottom = 0.2 * containerDiv.offsetHeight + "px";
}

function positionRobbyAtSeaFloorLevel() {
  robbyContainerDiv.style.bottom = seaFloorDiv.offsetHeight + "px";
}

function checkElevationNumberBelowRobby() {
  for (var e = 0; e < elevationArray.length; e++) {
    if (
      pageVerticalPosition <
        elevationArray[e].offsetLeft +
          elevationArray[e].offsetWidth -
          robbyLeftEdge &&
      pageVerticalPosition > elevationArray[e].offsetLeft - robbyRightEdge
    ) {
      elevationNumberBelowRobby = e;
      break;
    }
    elevationNumberBelowRobby = null;
  }
}

function animateWaterfall() {
  clearInterval(waterfallTimer),
    (waterfallTimer = setInterval(function () {
      switchWaterfallTexture();
    }, 1e3));
}

function switchWaterfallTexture() {
  $(waterfall2Div).fadeTo(0, 0),
    $(waterfall2Div)
      .stop()
      .delay(500)
      .animate(
        {
          opacity: 1,
        },
        0,
        function () {}
      );
}

function positionSeaFloorObjectsVertically() {
  for (var e = 0; e < seaFloorFrontObjectArray.length; e++)
    seaFloorFrontObjectArray[e].offsetHeight > sea1Div.offsetHeight
      ? (seaFloorFrontObjectArray[e].style.bottom =
          -1 *
            (seaFloorFrontObjectArray[e].offsetHeight - sea1Div.offsetHeight) +
          "px")
      : (seaFloorFrontObjectArray[e].style.bottom = "0px");
  for (e = 0; e < seaFloorBackObjectArray.length; e++)
    seaFloorBackObjectArray[e].offsetHeight > sea1Div.offsetHeight
      ? (seaFloorBackObjectArray[e].style.bottom =
          -0.7 * containerDiv.offsetHeight -
          (seaFloorBackObjectArray[e].offsetHeight - sea1Div.offsetHeight) +
          "px")
      : (seaFloorBackObjectArray[e].style.bottom = "-70%");
}

function animateScrollOrSwipeTextContainer() {
  1 == canAnimateScrollOrSwipeTextContainer &&
    ((canAnimateScrollOrSwipeTextContainer = !1),
    clearInterval(scrollOrSwipeTextContainerTimer),
    (scrollOrSwipeTextContainerTimer = setInterval(function () {
      turnOnAndOffScrollOrSwipeTextContainer();
    }, 1e3)));
}

function turnOnAndOffScrollOrSwipeTextContainer() {
  "computer" == deviceName
    ? ($(scrollOrSwipeTextContainer1Div).fadeTo(0, 1),
      $(scrollOrSwipeTextContainer1Div)
        .stop()
        .delay(500)
        .animate(
          {
            opacity: 0,
          },
          0,
          function () {}
        ))
    : ($(scrollOrSwipeTextContainer2Div).fadeTo(0, 1),
      $(scrollOrSwipeTextContainer2Div)
        .stop()
        .delay(500)
        .animate(
          {
            opacity: 0,
          },
          0,
          function () {}
        ));
}

function hideScrollOrSwipeTextContainer() {
  1 == canHideScrollOrSwipeTextContainer &&
    (clearInterval(scrollOrSwipeTextContainerTimer),
    fadeOutScrollOrSwipeTextContainer(),
    (canHideScrollOrSwipeTextContainer = !1));
}

function fadeOutScrollOrSwipeTextContainer() {
  $(scrollOrSwipeTextContainer1Div).fadeTo(0, 0),
    $(scrollOrSwipeTextContainer2Div).fadeTo(0, 0);
}

function positionContactConfirmationContainer() {
  for (var e = 0; e < contactConfirmationContainerArray.length; e++)
    (contactConfirmationContainerArray[e].style.left =
      "not moving 1" == layersMovement || "not moving 2" == layersMovement
        ? robbyContainerDiv.offsetLeft + "px"
        : robbyMaxHorizontalDistance + "px"),
      (contactConfirmationContainerArray[e].style.top =
        0.8 * containerDiv.offsetHeight - 370 + "px");
}

function hideContactConfirmationContainer() {
  if (1 == isContactConfirmationContainerVisible) {
    for (var e = 0; e < contactConfirmationContainerArray.length; e++)
      for (
        var t = $(contactConfirmationContainerArray[e])
            .children()
            .children().length,
          i = 0;
        i < t;
        i++
      )
        $(contactConfirmationContainerArray[e].children[0].children[i]).fadeTo(
          0,
          0
        );
    isContactConfirmationContainerVisible = !1;
  }
}

function showContactConfirmationContainer(e) {
  for (
    var t = $(contactConfirmationContainerArray[e])
        .children()
        .children().length,
      i = 0;
    i < t;
    i++
  )
    $(contactConfirmationContainerArray[e].children[0].children[i]).fadeTo(
      0,
      1
    );
  isContactConfirmationContainerVisible = !0;
}

function focusEmail() {
  emailAddressDiv.focus();
}

function focusSubject() {
  emailSubjectDiv.focus();
}

function focusMessage() {
  emailMessageDiv.focus();
}

function clearAllInputField() {
  (emailAddressDiv.value = ""),
    (emailSubjectDiv.value = ""),
    (emailMessageDiv.value = "");
}

function createFireworkSvg() {
  if (!("internet explorer" == browserName && browserVersion <= 8))
    for (var e = 0; e < fireworkArray.length; e++) {
      var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      t.setAttribute("version", "1.2"),
        t.setAttribute("baseProfile", "tiny"),
        t.setAttribute("width", "100%"),
        t.setAttribute("height", "100%"),
        fireworkSvgArray.push(t);
    }
}

function appendFireworkSvgToContainer() {
  if (!("internet explorer" == browserName && browserVersion <= 8))
    for (var e = 0; e < fireworkArray.length; e++)
      fireworkArray[e].appendChild(fireworkSvgArray[e]);
}

function drawManyFireworks() {
  ("internet explorer" == browserName && browserVersion <= 8) ||
    (1 == canDrawManyFireworks &&
      (clearInterval(drawFireworkTimer),
      (drawFireworkTimer = setInterval(function () {
        drawFirework();
      }, 1e3)),
      (canDrawManyFireworks = !1)));
}

function drawFirework() {
  drawFireworkCounter >= fireworkArray.length
    ? ((drawFireworkCounter = 0), clearInterval(drawFireworkTimer))
    : (clearInterval(drawOneLayerOfFireworkTimer),
      (drawOneLayerOfFireworkTimer = setInterval(function () {
        drawOneLayerOfFirework();
      }, 40)));
}

function drawOneLayerOfFirework() {
  if (fireworkLayerNumber < fireworkRowNumber) {
    fireworkLayerNumber += 1;
    for (var e = 0; e < fireworkColumnNumber; e++) {
      var t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      t.setAttribute(
        "cx",
        String(
          fireworkCenterX +
            Math.cos(e * fireworkOneRotationAngle) *
              (fireworkLayerNumber * fireworkOneRadiusDistance)
        )
      ),
        t.setAttribute(
          "cy",
          String(
            fireworkCenterY +
              Math.sin(e * fireworkOneRotationAngle) *
                (fireworkLayerNumber * fireworkOneRadiusDistance)
          )
        ),
        t.setAttribute("r", fireworkDotRadius),
        t.setAttribute("fill", "#ffffff"),
        fireworkSvgArray[drawFireworkCounter].appendChild(t);
    }
  } else
    (fireworkLayerNumber = 0),
      clearInterval(drawOneLayerOfFireworkTimer),
      makeFireworkDisappear(drawFireworkCounter),
      (drawFireworkCounter += 1);
}

function makeFireworkDisappear(e) {
  $(fireworkArray[e]).fadeTo(1e3, 0);
}

function resetFireworkSvg() {
  for (var e = 0; e < fireworkArray.length; e++)
    $(fireworkSvgArray[e]).empty(), $(fireworkArray[e]).fadeTo(0, 1);
}

function printResizeText() {}

function printScrollSwipeText() {}
var blinkRobbyEyesTimer,
  contentDiv = document.getElementById("content"),
  pageDiv = document.getElementById("page"),
  robbyContainerDiv = document.getElementById("robby-container"),
  robbyDiv = document.getElementById("robby"),
  robbyFramesDiv = document.getElementById("robby-slides"),
  robbyEyesCloseDiv = document.getElementById("robby-eyes-close"),
  bannersContainerDiv = document.getElementById("banners-container"),
  isPreloadShiftUpAnimationFinish = !1,
  canFinishShiftUpHorizontalLayersAfterEverythingLoaded = !0,
  splashContainerDiv = document.getElementById("splash-container"),
  balloonDiv = document.getElementById("balloon"),
  groundAndGrassContainer1Div = document.getElementById(
    "ground-and-grass-container-1"
  ),
  elevation1Div = document.getElementById("elevation-1"),
  elevation2Div = document.getElementById("elevation-2"),
  layerHorizontalArray = new Array(),
  layerVerticalArray = new Array(),
  gapBetweenContactCloudAndBannersContainer = 400,
  layerHorizontalSpeedArray = new Array(),
  layerVerticalSpeedArray = new Array(),
  sea1Div = document.getElementById("sea-1"),
  seaFloorDiv = document.getElementById("sea-floor"),
  seaFloorFrontObjectArray = new Array(),
  seaFloorBackObjectArray = new Array(),
  about1ContainerDiv = document.getElementById("plants-container"),
  plantLine1Div = document.getElementById("plant-line-1"),
  plantLine2Div = document.getElementById("plant-line-2"),
  plantArray = new Array(),
  plantTargetTopObjectArray = new Array();
plantTargetTopObjectArray.push(
  plantLine1Div,
  plantLine1Div,
  plantLine2Div,
  plantLine2Div
);
var canAnimatePlantInformation,
  about2ContainerDiv = document.getElementById("buildings-container"),
  buildingTargetLeft1 = 0,
  buildingTargetLeft2 = 305,
  buildingTargetLeft3 = 710,
  buildingEarlyPosition1 = 795,
  buildingEarlyPosition2 = 1100,
  buildingEarlyPosition3 = 1505,
  buildingArray = new Array(),
  buildingTargetLeftArray = new Array();
buildingTargetLeftArray.push(
  buildingTargetLeft1,
  buildingTargetLeft2,
  buildingTargetLeft3
);
var buildingEarlyPositionArray = new Array();
buildingEarlyPositionArray.push(
  buildingEarlyPosition1,
  buildingEarlyPosition2,
  buildingEarlyPosition3
);
var canAnimateBuildingInformation,
  buildingLegsTimer,
  buildingBlinkTimer,
  animateRobotHandsTimer,
  spinRobotHandsTimer,
  animateSquidHandsTimer,
  moveSquidHandsTimer,
  animateAlienHandsTimer,
  alienSteerPreviousAngle,
  canAnimateBossInformation,
  canAnimateRobotInformation,
  canAnimateSquidInformation,
  canAnimateAlienInformation,
  bubbleTimer,
  shiftUpLayerHorizontalDistance,
  shiftUpLayerHorizontalTimer,
  shiftDownLayerHorizontalTimer,
  blinkSeaAnimalsTimer,
  canAnimateFishInformation,
  buildingLegArray = new Array(),
  buildingCounter = 0,
  buildingEnemyFaceEyeArray = new Array(),
  buildingLegContainerArray = new Array(),
  buildingLegContainer1Div = document.getElementById(
    "building-leg-container-1"
  ),
  buildingLegContainer2Div = document.getElementById(
    "building-leg-container-2"
  ),
  buildingLegContainer3Div = document.getElementById(
    "building-leg-container-3"
  ),
  buildingLegFrameArray = new Array(),
  building1LegFrameDiv = document.getElementById("building-1-leg-frame"),
  building2LegFrameDiv = document.getElementById("building-2-leg-frame"),
  building3LegFrameDiv = document.getElementById("building-3-leg-frame"),
  experience1ContainerDiv = document.getElementById("experience-1-container"),
  experience2ContainerDiv = document.getElementById("experience-2-container"),
  experience3ContainerDiv = document.getElementById("experience-3-container"),
  experienceTextContainerArray = new Array(),
  chainBlockAndStringContainerArray = new Array(),
  experienceTextContainerDistanceFromFloor = 185,
  robotDiv = document.getElementById("robot"),
  changeRobotHandsCounter = 0,
  robotHandLeftDiv = document.getElementById("robot-hand-left"),
  robotHandRightDiv = document.getElementById("robot-hand-right"),
  robotHandChildrenLength = $(robotHandLeftDiv).children().length,
  squidDiv = document.getElementById("squid"),
  squidHandCloseArray = new Array(),
  squidHandOpenArray = new Array(),
  openAndCloseSquidHandsCounter = 0,
  alienDiv = document.getElementById("alien"),
  alienSteerDiv = document.getElementById("alien-steer"),
  alienSteerAngle = 0,
  alienSteerAngleLimit = 15,
  alienSteerAngleIncrement = 5,
  piechartRobotFrontDiv = document.getElementById("piechart-robot-front"),
  piechartRobotTextGraphic1Div = document.getElementById(
    "piechart-robot-text-graphic-1"
  ),
  piechartRobotTextGraphic2Div = document.getElementById(
    "piechart-robot-text-graphic-2"
  ),
  piechartRobotTextAnimation1Div = document.getElementById(
    "piechart-robot-text-animation-1"
  ),
  piechartRobotTextAnimation2Div = document.getElementById(
    "piechart-robot-text-animation-2"
  ),
  piechartRobotTextCode1Div = document.getElementById(
    "piechart-robot-text-code-1"
  ),
  piechartRobotTextCode2Div = document.getElementById(
    "piechart-robot-text-code-2"
  ),
  piechartSquidFrontDiv = document.getElementById("piechart-squid-front"),
  piechartSquidTextGraphic1Div = document.getElementById(
    "piechart-squid-text-graphic-1"
  ),
  piechartSquidTextGraphic2Div = document.getElementById(
    "piechart-squid-text-graphic-2"
  ),
  piechartSquidTextAnimation1Div = document.getElementById(
    "piechart-squid-text-animation-1"
  ),
  piechartSquidTextAnimation2Div = document.getElementById(
    "piechart-squid-text-animation-2"
  ),
  piechartSquidTextCode1Div = document.getElementById(
    "piechart-squid-text-code-1"
  ),
  piechartSquidTextCode2Div = document.getElementById(
    "piechart-squid-text-code-2"
  ),
  piechartAlienFrontDiv = document.getElementById("piechart-alien-front"),
  piechartAlienTextGraphic1Div = document.getElementById(
    "piechart-alien-text-graphic-1"
  ),
  piechartAlienTextGraphic2Div = document.getElementById(
    "piechart-alien-text-graphic-2"
  ),
  piechartAlienTextAnimation1Div = document.getElementById(
    "piechart-alien-text-animation-1"
  ),
  piechartAlienTextAnimation2Div = document.getElementById(
    "piechart-alien-text-animation-2"
  ),
  piechartAlienTextCode1Div = document.getElementById(
    "piechart-alien-text-code-1"
  ),
  piechartAlienTextCode2Div = document.getElementById(
    "piechart-alien-text-code-2"
  ),
  bubbleDiv = document.getElementById("bubble"),
  shiftUpDownLayerHorizontalIncrement = 40,
  shiftUpDownLayerHorizontalInterval = 40,
  seaAnimalSwimDistance = 900,
  skill1ContainerDiv = document.getElementById("skill-1-container"),
  fishArray = new Array(),
  fishEyeArray = new Array(),
  isFishStillAnimating = !1,
  fishAnimateNumber = 0,
  numberOfFishInEachRowArray = new Array();
numberOfFishInEachRowArray.push(5, 4, 5, 5, 5);
var canAnimateCrabInformation,
  skill2ContainerDiv = document.getElementById("skill-2-container"),
  crabArray = new Array(),
  crabEyeArray = new Array(),
  isCrabStillAnimating = !1,
  crabAnimateNumber = 0,
  numberOfCrabInEachRowArray = new Array();
numberOfCrabInEachRowArray.push(5, 4, 3, 5);
var canAnimateTurtleInformation,
  skill3ContainerDiv = document.getElementById("skill-3-container"),
  turtleArray = new Array(),
  turtleEyeArray = new Array(),
  isTurtleStillAnimating = !1,
  turtleAnimateNumber = 0,
  numberOfTurtleInEachRowArray = new Array();
numberOfTurtleInEachRowArray.push(4, 5, 3, 5, 3);
var isRobbyJumping,
  isRobbyFalling,
  swimUpHeight,
  layersMovement,
  robbyRightEdge,
  robbyLeftEdge,
  robbyMaxHorizontalDistance,
  canAnimateRobbyRunSwim,
  robbyStartFrame,
  robbyStopFrame,
  shiftRobbyFrameTimer,
  pageVerticalPositionWhenAnimateRobby1,
  pageVerticalPositionWhenAnimateRobby2,
  canAnimateNbaInformation,
  nbaBoardsCounter,
  nbaBoardsAnimationTimer,
  nbaPlayerCounter,
  nbaPlayerTimer,
  blinkNbaPlayerTimer,
  canAnimateSocialContainer,
  happyRobbyTimer,
  scrollOrSwipeTextContainerTimer,
  waterfallTimer,
  drawFireworkTimer,
  fireworkCenterX,
  fireworkCenterY,
  fireworkOneRadiusDistance,
  fireworkOneRotationAngle,
  drawOneLayerOfFireworkTimer,
  pageVerticalPosition = 0,
  pageVerticalPositionOnTouch = 0,
  previousPageVerticalPosition = 0,
  deltaPageVerticalPosition = 0,
  isRobbySwimming = !1,
  isRobbyBelowSeaLevel = !1,
  elevationArray = new Array(),
  elevationNumberBelowRobby = null,
  distanceBetweenRobbyAndBalloon = 150,
  counter = 0,
  switcher = 1,
  robbyStaticFrame = 0,
  robbyStartRunFrame = 1,
  robbyStopRunFrame = 2,
  robbyStartSwimFrame = 3,
  robbyStopSwimFrame = 4,
  robbySwimDownFrame = 5,
  robbyStartJumpFrame = 6,
  robbyStopJumpFrame = 7,
  robbyOneFrameWidth = 200,
  shiftRobbyFrameTimeInterval = 200,
  minimumVerticalDistanceToTriggerRobbySwimDownFrame = 100,
  nbaBoardArray = new Array(),
  about3ContainerDiv = document.getElementById("nba-container"),
  nbaPlayerDiv = document.getElementById("nba-player"),
  nbaPlayerContainerDiv = document.getElementById("nba-player-container"),
  nbaPlayerFrameDiv = document.getElementById("nba-player-frame"),
  nbaRimContainerDiv = document.getElementById("nba-rim-container"),
  nbaBallDiv = document.getElementById("nba-ball"),
  nbaPlayerEyesDiv = document.getElementById("nba-player-eyes"),
  contactContainerDiv = document.getElementById("contact-container"),
  socialContainerDiv = document.getElementById("social-container"),
  isRobbyHappy = !1,
  scrollOrSwipeTextContainer1Div = document.getElementById(
    "scroll-or-swipe-text-container-1"
  ),
  scrollOrSwipeTextContainer2Div = document.getElementById(
    "scroll-or-swipe-text-container-2"
  ),
  canHideScrollOrSwipeTextContainer = !0,
  canAnimateScrollOrSwipeTextContainer = !0,
  contactConfirmationContainerArray = new Array(),
  emailAddressDiv = document.getElementById("email-address"),
  emailSubjectDiv = document.getElementById("email-subject"),
  emailMessageDiv = document.getElementById("email-message"),
  isContactConfirmationContainerVisible = !0,
  waterfall1Div = document.getElementById("waterfall-1"),
  waterfall2Div = document.getElementById("waterfall-2"),
  touchStartX = 0,
  touchCurrentX = 0,
  touchEndX = 0,
  fireworksContainerDiv = document.getElementById("fireworks-container"),
  fireworkArray = new Array(),
  fireworkSvgArray = new Array(),
  cArray = new Array(),
  drawFireworkCounter = 0,
  fireworkRowNumber = 8,
  fireworkColumnNumber = 16,
  fireworkLayerNumber = 0,
  fireworkDotRadius = 5,
  canDrawManyFireworks = !0;
disableIsRobbyJumpingAndFalling();
var landInformationContainerArray = new Array();
landInformationContainerArray.push(
  about1ContainerDiv,
  about2ContainerDiv,
  about3ContainerDiv,
  experience1ContainerDiv,
  experience2ContainerDiv,
  experience3ContainerDiv
);
var canScrollOrSwipe,
  seaInformationContainerArray = new Array();
seaInformationContainerArray.push(
  skill1ContainerDiv,
  skill2ContainerDiv,
  skill3ContainerDiv
),
  setAllNbaCounter(),
  disableScrollOrSwipe(),
  $(window).on("beforeunload", function () {
    $(window).scrollTop(0);
  }),
  (window.onload = function () {
    "computer" != deviceName && initTouchEvents(),
      storeDivs(),
      setFrontLayerVerticalHeight(),
      setBannersContainerVerticalPosition(),
      shiftUpPreloader(),
      showContainer(),
      initVariablesAfterShowContainer(),
      shiftUpHorizontalLayersAfterEverythingLoaded(),
      disableAnimateRobbyRunSwim(),
      resetVariables(),
      setPageHeight(),
      setLayerSpeed(),
      positionVerticalLayersHorizontally(),
      positionBalloonAndRobbyContainerHorizontally(),
      positionBalloonVertically(),
      positionContactContainer(),
      positionFireworksContainer(),
      resetFunctions(),
      positionSplashContainer(),
      setRobbyLeftAndRightEdge(),
      positionContactConfirmationContainer(),
      hideContactConfirmationContainer(),
      hideRobbyEyesClose(),
      animateRobbyEyes(),
      animateWaterfall(),
      positionSeaFloorObjectsVertically(),
      openSquidHands(),
      hideBubble(),
      setRobotHandsToDefault(),
      createFireworkSvg(),
      appendFireworkSvgToContainer();
  }),
  (window.onscroll = function (e) {
    1 == canScrollOrSwipe &&
      (detectPageVerticalPosition(), runTheseFunctionsAfterScrollOrSwipe());
  }),
  (window.onresize = function (e) {
    setFrontLayerVerticalHeight(),
      setBannersContainerVerticalPosition(),
      setPageHeight(),
      detectPageVerticalPosition(),
      orientRobby(),
      setLayerSpeed(),
      moveLayers(),
      setRobbyLeftAndRightEdge(),
      shiftUpDownHorizontalLayersOnResize(),
      animateInformationAndEnemiesElements(),
      positionSplashContainer(),
      positionRobbyContainerVertically(),
      positionBalloonVertically(),
      positionSocialContainer(),
      positionPlants(),
      hideContactConfirmationContainer(),
      positionContactConfirmationContainer(),
      positionExperienceTextContainer(),
      positionChainBlockAndStringContainer(),
      positionSeaFloorObjectsVertically(),
      enableScrollOrSwipe(),
      printResizeText();
  }),
  $(window).on("orientationchange", orientationChangeHandler);
