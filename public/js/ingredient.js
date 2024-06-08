$(document).ready(function () {
    recipeLink.click(function(event) {
        confirmRecipeBtn.removeClass('d-none');
        $(this).closest('.recipe-card').addClass('selected');
        let selectedId = $(this).attr('id');

        $('.recipe-link').each(function() {
            let otherId = $(this).attr('id');

            if (selectedId != otherId) {
                $(this).closest('.recipe-card').removeClass('selected');
            } 
        });

        selectedRecipeIdInput.val(selectedId);
    })
})