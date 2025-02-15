class TerminalResume {
  constructor() {
    this.output = document.getElementById("output");
    this.input = document.getElementById("command-input");
    this.terminal = document.querySelector(".terminal");
    this.terminalContainer = document.querySelector(".terminal-container");
    this.contextMenu = document.querySelector(".context-menu");
    this.terminals = [{ input: this.input, history: [], historyIndex: -1 }];
    this.activeTerminal = 0;
    this.activeTerminalContent = null;
    this.resizing = null;
    this.setupEventListeners();
    this.init();
  }

  init() {
    this.printWelcomeMessage();
    this.input.focus();
    this.setupContextMenu();
  }

  setupContextMenu() {
    // Handle right-click on terminal content
    this.terminalContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const terminalContent = e.target.closest(".terminal-content");
      if (terminalContent) {
        this.activeTerminalContent = terminalContent;
        this.showContextMenu(e.clientX, e.clientY);
      }
    });

    // Hide context menu on click outside
    document.addEventListener("click", () => {
      this.contextMenu.classList.remove("active");
    });

    // Handle menu item clicks
    this.contextMenu.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      if (action) {
        this.handleContextMenuAction(action);
      }
    });
  }

  showContextMenu(x, y) {
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.classList.add("active");

    // Show/hide close option based on whether this terminal can be closed
    const closeOption = this.contextMenu.querySelector(
      '[data-action="close-split"]'
    );
    const isMainTerminal =
      this.activeTerminalContent === this.terminalContainer.firstElementChild;
    closeOption.style.display = isMainTerminal ? "none" : "block";
  }

  handleContextMenuAction(action) {
    if (!this.activeTerminalContent) return;

    switch (action) {
      case "split-h":
        this.splitTerminal("horizontal", this.activeTerminalContent);
        break;
      case "split-v":
        this.splitTerminal("vertical", this.activeTerminalContent);
        break;
      case "close-split":
        this.closeSplit(this.activeTerminalContent);
        break;
    }
    this.contextMenu.classList.remove("active");
  }

  setupEventListeners() {
    // Global click handler for terminal focus
    this.terminalContainer.addEventListener("click", (e) => {
      const terminalContent = e.target.closest(".terminal-content");
      if (terminalContent) {
        const input = terminalContent.querySelector("input");
        if (input) {
          input.focus();
          this.activeTerminal = this.terminals.findIndex(
            (t) => t.input === input
          );
        }
      }
    });

    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl + Shift + H for horizontal split
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        const activeContent =
          this.terminals[this.activeTerminal].input.closest(
            ".terminal-content"
          );
        if (activeContent) {
          this.splitTerminal("horizontal", activeContent);
        }
      }
      // Ctrl + Shift + V for vertical split
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        const activeContent =
          this.terminals[this.activeTerminal].input.closest(
            ".terminal-content"
          );
        if (activeContent) {
          this.splitTerminal("vertical", activeContent);
        }
      }
    });

    // Setup initial input handlers
    this.setupInputHandlers(this.input);
  }

  setupInputHandlers(inputElement) {
    inputElement.addEventListener("keydown", (e) => {
      const terminal = this.terminals.find((t) => t.input === inputElement);
      if (!terminal) return;

      if (e.key === "Enter") {
        this.handleCommand(inputElement);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateHistory("up", terminal);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateHistory("down", terminal);
      } else if (e.key === "l" && e.ctrlKey) {
        // Handle Ctrl+L (clear screen)
        e.preventDefault();
        const outputElement = inputElement
          .closest(".terminal-content")
          .querySelector("[id^='output']");
        outputElement.innerHTML = "";
        this.printWelcomeMessage(outputElement);
      } else if (e.key === "Tab") {
        // Handle Tab completion
        e.preventDefault();
        this.handleTabCompletion(inputElement);
      }
    });
  }

  handleTabCompletion(inputElement) {
    const currentInput = inputElement.value.toLowerCase().trim();
    const commands = [
      "help",
      "about",
      "skills",
      "experience",
      "education",
      "contact",
      "clear",
    ];

    // Find matching commands
    const matches = commands.filter((cmd) => cmd.startsWith(currentInput));

    if (matches.length === 1) {
      // Single match - complete the command
      inputElement.value = matches[0];
    } else if (matches.length > 1 && currentInput) {
      // Multiple matches - show possibilities
      const outputElement = inputElement
        .closest(".terminal-content")
        .querySelector("[id^='output']");

      const matchesText = `\nPossible commands:\n${matches.join("  ")}`;
      this.printToOutput(outputElement, matchesText, "info");
    }
  }

  navigateHistory(direction, terminal) {
    if (
      direction === "up" &&
      terminal.historyIndex < terminal.history.length - 1
    ) {
      terminal.historyIndex++;
    } else if (direction === "down" && terminal.historyIndex > -1) {
      terminal.historyIndex--;
    }

    if (
      terminal.historyIndex >= 0 &&
      terminal.historyIndex < terminal.history.length
    ) {
      terminal.input.value =
        terminal.history[terminal.history.length - 1 - terminal.historyIndex];
    } else {
      terminal.input.value = "";
    }
  }

  splitTerminal(direction, sourceTerminal) {
    const parentContainer = sourceTerminal.parentElement;
    const isAlreadySplit = parentContainer.children.length > 1;
    const splitClass = direction === "horizontal" ? "split-h" : "split-v";

    // If parent is not split or split in different direction, create new container
    if (!isAlreadySplit || !parentContainer.classList.contains(splitClass)) {
      const newContainer = document.createElement("div");
      newContainer.className = `terminal-container ${splitClass}`;

      // Move source terminal to new container
      sourceTerminal.parentElement.insertBefore(newContainer, sourceTerminal);
      newContainer.appendChild(sourceTerminal);

      // Create new terminal in the container
      this.createNewTerminalContent(newContainer);
    } else {
      // Add new terminal to existing split container
      this.createNewTerminalContent(parentContainer);
    }
  }

  createNewTerminalContent(container) {
    const newContent = document.createElement("div");
    newContent.className = "terminal-content";
    const timestamp = Date.now();
    newContent.innerHTML = `
      <div id="output-${timestamp}" class="terminal-output"></div>
      <div class="input-line">
        <span class="prompt">➜</span>
        <input type="text" id="command-input-${timestamp}" class="command-input" />
      </div>
    `;

    // Add resize handle if not the last element
    if (container.children.length > 0) {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${
        container.classList.contains("split-h") ? "horizontal" : "vertical"
      }`;
      container.lastElementChild.appendChild(handle);
      this.setupResizeHandle(handle);
    }

    container.appendChild(newContent);

    // Setup new input
    const newInput = newContent.querySelector(".command-input");
    this.setupInputHandlers(newInput);

    // Add to terminals array
    this.terminals.push({
      input: newInput,
      history: [],
      historyIndex: -1,
    });

    // Print welcome message in new terminal
    const newOutput = newContent.querySelector(`#output-${timestamp}`);
    this.printWelcomeMessage(newOutput);

    // Focus new terminal
    newInput.focus();
    this.activeTerminal = this.terminals.length - 1;
  }

  setupResizeHandle(handle) {
    const isHorizontal = handle.classList.contains("horizontal");

    const startResize = (e) => {
      e.preventDefault();
      this.resizing = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        parentContainer: handle.closest(".terminal-container"),
        element: handle.parentElement,
        initialSize: isHorizontal
          ? handle.parentElement.offsetWidth
          : handle.parentElement.offsetHeight,
      };

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    };

    const resize = (e) => {
      if (!this.resizing) return;

      const { parentContainer, element, startX, startY, initialSize } =
        this.resizing;
      const containerRect = parentContainer.getBoundingClientRect();

      if (isHorizontal) {
        const deltaX = e.clientX - startX;
        const newWidth = initialSize + deltaX;
        const maxWidth = containerRect.width - 150; // Leave space for other splits

        if (newWidth >= 150 && newWidth <= maxWidth) {
          const percentage = (newWidth / containerRect.width) * 100;
          element.style.flex = "none";
          element.style.width = `${percentage}%`;
        }
      } else {
        const deltaY = e.clientY - startY;
        const newHeight = initialSize + deltaY;
        const maxHeight = containerRect.height - 100;

        if (newHeight >= 100 && newHeight <= maxHeight) {
          const percentage = (newHeight / containerRect.height) * 100;
          element.style.flex = "none";
          element.style.height = `${percentage}%`;
        }
      }
    };

    const stopResize = () => {
      this.resizing = null;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    handle.addEventListener("mousedown", startResize);
  }

  printToOutput(outputElement, text, className = "") {
    if (!text) {
      outputElement.innerHTML = "";
      return;
    }

    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;

    // Ensure consistent text formatting
    line.style.whiteSpace = "pre-wrap";
    line.style.marginBottom = "0.5rem";

    outputElement.appendChild(line);

    // Force scroll to bottom
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  scrollToBottom(terminalContent) {
    if (!terminalContent) return;

    // Only scroll if content is actually overflowing
    if (terminalContent.scrollHeight > terminalContent.clientHeight) {
      const currentScrollTop = terminalContent.scrollTop;
      const maxScroll =
        terminalContent.scrollHeight - terminalContent.clientHeight;

      // If we're not already at the bottom, scroll
      if (currentScrollTop < maxScroll) {
        terminalContent.scrollTop = maxScroll;

        // Use requestAnimationFrame to ensure scroll happens after render
        requestAnimationFrame(() => {
          terminalContent.scrollTop = maxScroll;
        });
      }
    }
  }

  handleCommand(inputElement) {
    const terminal = this.terminals.find((t) => t.input === inputElement);
    if (!terminal) return;

    const command = inputElement.value.trim().toLowerCase();
    const outputElement = inputElement
      .closest(".terminal-content")
      .querySelector("[id^='output']");

    this.printToOutput(outputElement, `➜ ${command}`, "command");
    terminal.history.push(command);
    terminal.historyIndex = -1;
    inputElement.value = "";

    // Execute command
    switch (command) {
      case "help":
        this.showHelp(outputElement);
        break;
      case "about":
        this.showAbout(outputElement);
        break;
      case "experience":
        this.showExperience(outputElement);
        break;
      case "education":
        this.showEducation(outputElement);
        break;
      case "skills":
        this.showSkills(outputElement);
        break;
      case "contact":
        this.showContact(outputElement);
        break;
      case "clear":
        outputElement.innerHTML = "";
        this.printWelcomeMessage(outputElement);
        break;
      case "":
        break;
      default:
        this.printToOutput(
          outputElement,
          `Command not found: ${command}. Type 'help' for available commands.`,
          "error"
        );
    }

    // Ensure we're scrolled to bottom after command execution
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  printWelcomeMessage(outputElement = this.output) {
    const asciiArt = `███╗   ███╗ █████╗ ██████╗      ██╗ ██████╗
████╗ ████║██╔══██╗██╔══██╗     ██║██╔═══██╗
██╔████╔██║███████║██████╔╝     ██║██║   ██║
██║╚██╔╝██║██╔══██║██╔══██╗██   ██║██║   ██║
██║ ╚═╝ ██║██║  ██║██║  ██║╚█████╔╝╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝  ╚═════╝ `;

    const divider = "─".repeat(56);

    const welcome =
      this.wrapWithColor(asciiArt + "\n", "#d4843e") +
      this.wrapWithColor(divider + "\n", "#555555") +
      this.wrapWithColor(
        "                Interactive Terminal Resume\n",
        "#888888"
      ) +
      this.wrapWithColor(
        "          Software Engineer • Cloud Architect • Tech Lead\n",
        "#666666"
      ) +
      this.wrapWithColor(divider + "\n\n", "#555555") +
      this.wrapWithColor("Type ", "#666666") +
      this.wrapWithColor("'help'", "#87af87") +
      this.wrapWithColor(" to see available commands\n", "#666666") +
      this.wrapWithColor("Press ", "#666666") +
      this.wrapWithColor("'tab'", "#87af87") +
      this.wrapWithColor(" to auto-complete commands", "#666666");

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = welcome;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showHelp(outputElement = this.output) {
    const title = this.wrapWithColor("🚀 Available Commands\n\n", "#ffff00");

    const commands =
      this.wrapWithColor("Commands:\n", "#00ffff") +
      this.wrapWithColor("• help", "#98fb98") +
      "       " +
      this.wrapWithColor("Show this help message\n", "#ffffff") +
      this.wrapWithColor("• about", "#98fb98") +
      "      " +
      this.wrapWithColor("Display my professional summary\n", "#ffffff") +
      this.wrapWithColor("• skills", "#98fb98") +
      "     " +
      this.wrapWithColor("View my technical expertise\n", "#ffffff") +
      this.wrapWithColor("• experience", "#98fb98") +
      " " +
      this.wrapWithColor("Show my work history\n", "#ffffff") +
      this.wrapWithColor("• education", "#98fb98") +
      "  " +
      this.wrapWithColor("View my educational background\n", "#ffffff") +
      this.wrapWithColor("• contact", "#98fb98") +
      "    " +
      this.wrapWithColor("Get my contact information\n", "#ffffff") +
      this.wrapWithColor("• clear", "#98fb98") +
      "      " +
      this.wrapWithColor("Clear the terminal screen\n", "#ffffff");

    const shortcuts =
      "\n" +
      this.wrapWithColor("Shortcuts:\n", "#666666") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("↑/↓", "#666666") +
      "         " +
      this.wrapWithColor("Navigate command history\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Tab", "#666666") +
      "         " +
      this.wrapWithColor("Auto-complete commands\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+L", "#666666") +
      "      " +
      this.wrapWithColor("Clear the screen\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+Shift+H", "#666666") +
      " " +
      this.wrapWithColor("Split horizontally\n", "#444444") +
      this.wrapWithColor("• ", "#666666") +
      this.wrapWithColor("Ctrl+Shift+V", "#666666") +
      " " +
      this.wrapWithColor("Split vertically", "#444444");

    const help = title + commands + shortcuts;

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = help;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showAbout(outputElement = this.output) {
    const about = `<span style="color: #ff8c00; font-weight: bold;">✨ About Me</span>

${this.wrapWithColor(
  "┌─────────────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Senior software engineer with more than 10 years of",
      "#ffffff"
    )}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "programming experience.",
      "#ffffff"
    )}
${this.wrapWithColor(
  "└─────────────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("⚡ Experience", "#ff8c00")}
${this.wrapWithColor(
  "   Building scalable and efficient software solutions using",
  "#ffffff"
)}
${this.wrapWithColor("   React, JavaScript, and Google Cloud", "#ff8c00")}

${this.wrapWithColor("⚡ Passion", "#ff8c00")}
${this.wrapWithColor(
  "   Transforming innovative ideas into high-quality applications",
  "#ffffff"
)}
${this.wrapWithColor(
  "   with elegant and efficient implementations",
  "#ffffff"
)}

${this.wrapWithColor("⚡ Strengths", "#ff8c00")}
${this.wrapWithColor(
  "   Strong team player with expertise in designing robust,",
  "#ffffff"
)}
${this.wrapWithColor("   high-performance systems", "#ffffff")}

${this.wrapWithColor(
  "╭───────────────────────────────────────────────────────╮",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Ready to bring your innovative ideas to life!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "╰───────────────────────────────────────────────────────╯",
  "#ff8c00"
)}`;

    const aboutDiv = document.createElement("div");
    aboutDiv.innerHTML = about;
    outputElement.appendChild(aboutDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  // Helper method to wrap text with color
  wrapWithColor(text, color) {
    return `<span style="color: ${color}">${text}</span>`;
  }

  showExperience(outputElement = this.output) {
    const experience = `<span style="color: #ffff00; font-weight: bold;">💼 Professional Experience</span>

<span style="color: #00ffff;">UNICEPTA | Senior Software Engineer</span>
${this.wrapWithColor(
  "Jul 2020 - Present | Cologne, Germany | 450+ employees",
  "#ffffff"
)}
${this.wrapWithColor(
  "Visionary, AI-powered Media & Data Intelligence Solutions",
  "#98fb98"
)}

• ${this.wrapWithColor("Part of Core team", "#ffa07a")} - ${this.wrapWithColor(
      "Architect and part of every decision.",
      "#ffffff"
    )}
• ${this.wrapWithColor(
      "Microservices engineer",
      "#ffa07a"
    )} - ${this.wrapWithColor(
      "Designed and build services for distributed system",
      "#ffffff"
    )}
• ${this.wrapWithColor("Pipeline engineer", "#ffa07a")} - ${this.wrapWithColor(
      "Google cloud engineer for data pipeline",
      "#ffffff"
    )}
• ${this.wrapWithColor("Fullstack engineer", "#ffa07a")} - ${this.wrapWithColor(
      "Wrote and reviewed code for front/back/cloud.",
      "#ffffff"
    )}

${this.wrapWithColor("Technologies used:", "#00ffff")} ${this.wrapWithColor(
      "Typescript, React, NodeJs, Poetry, PyTest, ReactJS, Jest, Cypress, ES6, ElasticSearch, Google Cloud, JIRA, Firebase, Kubernetes, Data Flow",
      "#87cefa"
    )}

<span style="color: #00ffff;">RITECH SOLUTIONS | Senior Software Engineer</span>
${this.wrapWithColor(
  "Jul 2018 – Jul 2020 | Tirana, Albania | 100-150 employees",
  "#ffffff"
)}

• ${this.wrapWithColor("Part of Core team", "#ffa07a")} - ${this.wrapWithColor(
      "Team that leads company tech decisions",
      "#ffffff"
    )}
• ${this.wrapWithColor("Tech interviewer", "#ffa07a")} - ${this.wrapWithColor(
      "Interview potential candidates.",
      "#ffffff"
    )}
• ${this.wrapWithColor("Microsoft project", "#ffa07a")} - ${this.wrapWithColor(
      "IOT marketing project in every Microsoft store.",
      "#ffffff"
    )}
• ${this.wrapWithColor("Fullstack engineer", "#ffa07a")} - ${this.wrapWithColor(
      "Wrote and reviewed code for big projects.",
      "#ffffff"
    )}
• ${this.wrapWithColor(
      "AppriseMobile Tech Lead",
      "#ffa07a"
    )} - ${this.wrapWithColor(
      "CRM for Toyota and corporates in USA",
      "#ffffff"
    )}

${this.wrapWithColor("Technologies used:", "#00ffff")} ${this.wrapWithColor(
      "JavaScript, Python, pandas, NodeJs, ReactJS, Chai, Sinon, Mocha, ES6, ElasticSearch, Redis, Nginx, Gulp, JIRA, Docker, Azure, AWS, MongoDB",
      "#87cefa"
    )}

<span style="color: #00ffff;">GUTENBERG TECHNOLOGY | Software Engineering</span>
${this.wrapWithColor(
  "Feb 2017 – Aug 2018 | Paris, France | 50-100 employees",
  "#ffffff"
)}

• ${this.wrapWithColor(
      "Fullstack developer",
      "#ffa07a"
    )} - ${this.wrapWithColor(
      "Frontend and backend (real-time publisher platform) used by National Geographics, IUBH, Fujitsu",
      "#ffffff"
    )}
• ${this.wrapWithColor("MEFIO developer", "#ffa07a")} - ${this.wrapWithColor(
      "Highly available publisher platform",
      "#ffffff"
    )}
• ${this.wrapWithColor(
      "Webreader developer",
      "#ffa07a"
    )} - ${this.wrapWithColor(
      "reader platform, e-Learning platform",
      "#ffffff"
    )}
• ${this.wrapWithColor("SaaS developer", "#ffa07a")} - ${this.wrapWithColor(
      "Integrated strategy to migrate from manual sales to SaaS",
      "#ffffff"
    )}

${this.wrapWithColor("Technologies used:", "#00ffff")} ${this.wrapWithColor(
      "Python, ES6, ElasticSearch, Redis, Nginx, npm, Gulp, JIRA, Docker, AWS S3, RethinkDB, ReactJS, NodeJS, AngularJS, JavaScript",
      "#87cefa"
    )}

<span style="color: #00ffff;">GROUP OF COMPANIES | Software Engineer</span>
${this.wrapWithColor(
  "Mar 2015 – Feb 2017 | Tirana, Albania | 5-30 employees",
  "#ffffff"
)}

• ${this.wrapWithColor("Software developer", "#ffa07a")} - ${this.wrapWithColor(
      "Developed web and native projects",
      "#ffffff"
    )}
• ${this.wrapWithColor("Bar management app", "#ffa07a")} - ${this.wrapWithColor(
      "Developed app for bar/restaurant management.",
      "#ffffff"
    )}
• ${this.wrapWithColor(
      "Bank system optimisation",
      "#ffa07a"
    )} - ${this.wrapWithColor(
      "Optimised aggregation from 11h to 1h",
      "#ffffff"
    )}
• ${this.wrapWithColor("UKD developer", "#ffa07a")} - ${this.wrapWithColor(
      "Water supply billing process for Albania, Government project",
      "#ffffff"
    )}

${this.wrapWithColor("Technologies used:", "#00ffff")} ${this.wrapWithColor(
      "Typescript, Python, Gulp, Docker, MongoDB, ReactJS, NodeJs, AngularJS, JavaScript, Java",
      "#87cefa"
    )}`;

    const experienceDiv = document.createElement("div");
    experienceDiv.innerHTML = experience;
    outputElement.appendChild(experienceDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showEducation(outputElement = this.output) {
    const education = `<span style="color: #ff8c00; font-weight: bold;">🎓 Education</span>

${this.wrapWithColor(
  "┌──────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")}${this.wrapWithColor(
      " Bachelor of Computer Science ",
      "#ffffff"
    )}${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "└──────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("🏛️ Institution:", "#ff8c00")} ${this.wrapWithColor(
      "University of Tirana",
      "#ffffff"
    )}
${this.wrapWithColor("📅 Duration:", "#ff8c00")}    ${this.wrapWithColor(
      "2013 - 2016",
      "#ffffff"
    )}
${this.wrapWithColor("📍 Location:", "#ff8c00")}    ${this.wrapWithColor(
      "Tirana, Albania",
      "#ffffff"
    )}

${this.wrapWithColor(
  "╭──────────────────────────────────────────────────╮",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")}${this.wrapWithColor(
      " Foundation of my software engineering journey ",
      "#ffffff"
    )}${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "╰──────────────────────────────────────────────────╯",
  "#ff8c00"
)}`;

    const educationDiv = document.createElement("div");
    educationDiv.innerHTML = education;
    outputElement.appendChild(educationDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showSkills(outputElement = this.output) {
    const skills = `<span style="color: #ffff00; font-weight: bold;">🛠️ PROGRAMMING</span>

• ${this.wrapWithColor("Typescript", "#ffffff")}
• ${this.wrapWithColor("Python", "#ffffff")}
• ${this.wrapWithColor("Javascript", "#ffffff")}
• ${this.wrapWithColor("Node", "#ffffff")}
• ${this.wrapWithColor("React", "#ffffff")}
• ${this.wrapWithColor("Angular", "#ffffff")}
• ${this.wrapWithColor("Google Cloud", "#ffffff")}
• ${this.wrapWithColor("AWS", "#ffffff")}
• ${this.wrapWithColor("Azure", "#ffffff")}
• ${this.wrapWithColor("Docker", "#ffffff")}
• ${this.wrapWithColor("Terraform", "#ffffff")}
• ${this.wrapWithColor("Kubernetes", "#ffffff")}
• ${this.wrapWithColor("Java", "#ffffff")}
• ${this.wrapWithColor("Kotlin", "#ffffff")}
• ${this.wrapWithColor("MongoDB", "#ffffff")}
• ${this.wrapWithColor("RethinkDB", "#ffffff")}
• ${this.wrapWithColor("Jest", "#ffffff")}
• ${this.wrapWithColor("ElasticSearch", "#ffffff")}
• ${this.wrapWithColor("GraphQL", "#ffffff")}
• ${this.wrapWithColor("Express", "#ffffff")}
• ${this.wrapWithColor("Redis", "#ffffff")}
• ${this.wrapWithColor("SQL", "#ffffff")}
• ${this.wrapWithColor("HTML", "#ffffff")}
• ${this.wrapWithColor("CSS", "#ffffff")}`;

    const skillsDiv = document.createElement("div");
    skillsDiv.innerHTML = skills;
    outputElement.appendChild(skillsDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  showContact(outputElement = this.output) {
    const contact = `<span style="color: #ff8c00; font-weight: bold;">📫 Contact Information</span>

${this.wrapWithColor("┌────────────────────────────────────────┐", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Let's connect and create something great!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("└────────────────────────────────────────┘", "#ff8c00")}

${this.wrapWithColor("✉", "#ff8c00")}  ${this.wrapWithColor(
      "Email:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="mailto:marjoballabani@gmail.com" style="color: #ffffff; text-decoration: none;">marjoballabani@gmail.com</a>',
      "#ffffff"
    )}

${this.wrapWithColor("🌐", "#ff8c00")}  ${this.wrapWithColor(
      "Website:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://marjoballabani.me" target="_blank" style="color: #ffffff; text-decoration: none;">marjoballabani.me</a>',
      "#ffffff"
    )}

${this.wrapWithColor("⚡", "#ff8c00")}  ${this.wrapWithColor(
      "Github:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://github.com/marjoballabani" target="_blank" style="color: #ffffff; text-decoration: none;">github.com/marjoballabani</a>',
      "#ffffff"
    )}

${this.wrapWithColor("💼", "#ff8c00")}  ${this.wrapWithColor(
      "LinkedIn:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://linkedin.com/in/marjo-ballabani" target="_blank" style="color: #ffffff; text-decoration: none;">linkedin.com/in/marjo-ballabani</a>',
      "#ffffff"
    )}

${this.wrapWithColor("╭────────────────────────────────────────╮", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Feel free to reach out for opportunities!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("╰────────────────────────────────────────╯", "#ff8c00")}`;

    const contactDiv = document.createElement("div");
    contactDiv.innerHTML = contact;
    outputElement.appendChild(contactDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  closeSplit(terminalContent) {
    const container = terminalContent.parentElement;
    const input = terminalContent.querySelector("input");

    // Remove from terminals array
    const terminalIndex = this.terminals.findIndex((t) => t.input === input);
    if (terminalIndex > -1) {
      this.terminals.splice(terminalIndex, 1);
    }

    // Remove the terminal content
    terminalContent.remove();

    // If container is empty or has only one child, move remaining content up
    if (
      container.children.length <= 1 &&
      container !== this.terminalContainer
    ) {
      if (container.children.length === 1) {
        const remainingContent = container.firstElementChild;
        container.parentElement.insertBefore(remainingContent, container);
      }
      container.remove();
    }

    // Focus the previous terminal
    if (this.terminals.length > 0) {
      const newActiveIndex = Math.min(terminalIndex, this.terminals.length - 1);
      this.terminals[newActiveIndex].input.focus();
      this.activeTerminal = newActiveIndex;
    }
  }
}

// Initialize the terminal
new TerminalResume();
