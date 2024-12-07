document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[data-scroll]");
    const links = document.querySelectorAll(".scroll-link");
    let currentIndex = 0;
  
    function scrollToSection(index) {
      const targetSection = sections[index];
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        currentIndex = index;
      }
    }
  
    links.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(index);
      });
    });
  
    // Add keyboard navigation (optional)
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
        scrollToSection(currentIndex + 1);
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        scrollToSection(currentIndex - 1);
      }
    });
  });