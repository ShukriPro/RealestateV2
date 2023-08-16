$(document).ready(function(){
    $("#housemodal").on("show.bs.modal", function(event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var description = button.data("description"); // Get the data-description attribute
      var imageName = button.data("image"); // Get the data-image attribute
      var imageSrc = "/images/houses/" + imageName; // Construct the full image URL
      var modal = $(this);
      modal.find(".modal-header > img").attr("src", imageSrc); // Set image source
      modal.find(".modal-body").text(description); // Set description
    });
  });
  