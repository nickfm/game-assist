// Template.appMain.onRendered(function() {
//   this.find('#main')._uihooks = {
//     insertElement: function(node, next) {
//       $(node)
//         .hide()
//         .insertBefore(next)
//         .fadeIn(function () {
//           listFadeInHold.release();
//         });
//     },
//     removeElement: function(node) {
//       $(node).fadeOut(function() {
//         $(this).remove();
//       });
//     }
//   };
// });

Template.appMain.events({
  'keydown input[type=number]': function(e, template) {
    var charCode = (e.which) ? e.which : e.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
});
