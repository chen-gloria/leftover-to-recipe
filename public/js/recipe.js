const recipeLink = $('.recipe-link');
const confirmRecipeBtn = $('#confirmRecipeBtn');
const selectedRecipeIdInput = $('#selectedRecipeIdInput');

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
    })

    confirmRecipeBtn.on('click', function(e) {
        $('.recipe-card.selected').find('form').submit();
    })
})