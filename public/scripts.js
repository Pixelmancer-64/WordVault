const flash = document.getElementById("remove");
if (flash) {
  flash.addEventListener("click", function () {
    console.log(this);
    this.parentElement.remove();
  });

  setTimeout(() => {
    flash.parentElement.remove();
  }, 2000);
}
