const recipeLink = $('.recipe-link');
const confirmRecipeBtn = $('#confirmRecipeBtn');
const selectedRecipeIdInput = $('#selectedRecipeIdInput');
const stars = $('.stars input[type="radio"]');

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


    stars.each(function() {
       $(this).prop('checked', false);
    })

    stars.on('change', function(e) {
        let starId = $(this).val();

        stars.each(function(e) {
            if ($(this).val() <= starId) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        })

        // Open the thank you modal and go back to the main page
        $('#thankyouModal').modal('show')
    })
})