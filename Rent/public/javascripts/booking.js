Stripe.setPublishableKey('pk_test_Rhvt4Mgx09UpkOfTcOEj4R6b00ljQULwRh');

var $form = $('#booking-form');

$form.submit(function(event){
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
number: $('#card-number').val(),
cvc: $('#card-cvc').val(),
exp_month: $('#card-expiry-month').val(),
exp_year: $('#card-expiry-year').val(),
name: $('#card-name').val()
    }, stripeResponsiveHandler);
    return false;
});
$('#card-name, #card-number, #card-expiry-year, #card-expiry-month, #card-cvc').input(function(){
    $form.find('button').prop('disabled', true);
    
})
function stripeResponsiveHandler(status, response) {

if(response.error){
    $('#charge-error').text(response.error.message);
    $form.find('button').prop('disabled', false);
} else {
    var token = response.id;
    $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
    $form.get(0).submit();
}

}