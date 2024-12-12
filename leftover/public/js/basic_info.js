const personAllergiesInput = $('.person-allergies-input');
const personPreferencesInput = $('.person-preferences-input');
const personAllergiesSubmit = $('.personAllergies');
const personPreferencesSubmit = $('.personPreferences');

$(document).ready(function () {
    personAllergiesInput.on('input', function(e) {
        let allergies = $(this).val();

        personAllergiesInput.each(function() {
            $(this).val(allergies);
        })
        personAllergiesSubmit.each(function() {
            $(this).val(allergies);
        })
    })

    personPreferencesInput.on('input', function(e) {
        let preferences = $(this).val();

        personPreferencesInput.each(function() {
            $(this).val(preferences);
         })

        personPreferencesSubmit.each(function() {
            $(this).val(preferences);
        })
    })
})