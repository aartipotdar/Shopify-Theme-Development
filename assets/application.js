// Put your application javascript here
if(document.getElementById('sort_by') != null) {
document.querySelector('#sort_by').addEventListener('change', function(e){
  var url = new URL(window.location.href);
  url.searchParams.set('sort_by',  e.currentTarget.value);

  window.location = url.href;
});
}

if(document.getElementById('country') != null) {
  document.getElementById('country').addEventListener('change', function(e) {
    var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
    var provinceSelected = document.getElementById('province');
    var provinceArray = JSON.parse(provinces);

    // console.log(provinceArray);
    if(provinceArray.length < 1) {
      provinceSelected.setAttribute('disabled','disabled');
    } else {
      provinceSelected.removeAttribute('disabled');
    }

    provinceSelected.innerHTML = '';
    var options = '';
    for(var i = 0; i < provinceArray.length; i++) {
      options += '<option value="' + provinceArray[i][0] + '">'+ provinceArray[i][0] +'</option>';
    }

    provinceSelected.innerHTML = options;
  });
}

if(document.getElementById('forgotPassword') != null) {
  document.getElementById('forgotPassword').addEventListener("click", function(e) {
      const element = document.querySelector('#forgot_password_form');
      if(element.classList.contains('d-none')) {
        element.classList.remove('d-none');
        element.classList.add('d-block');
      }
  });
}

var localeItems = document.querySelectorAll('#localeItem');
if(localeItems.length > 0) {
  localeItems.forEach(item => {
    item.addEventListener('click', event => {
     document.getElementById('localeCode').value = item.getAttribute('lang');
     document.getElementById('localization_form_tag').submit();
    });
  });
}

var productInfoAnchors = document.querySelectorAll('#productInfoAnchor');


var productModal;

if(document.getElementById('productInfoModal') != null) {
  productModal = new bootstrap.Modal(document.getElementById('productInfoModal'), {});
}

if(productInfoAnchors.length > 0) {
  productInfoAnchors.forEach(item => {
   item.addEventListener('click', event => {
    console.log("clicked");
    var url = '/products/' + item.getAttribute('product-handle') + '.js'

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
      
      document.getElementById("productInfoImg").src =data.images[0];
      document.getElementById('productInfoTitle').innerHTML = data.title;
      document.getElementById('productInfoPrice').innerHTML = item.getAttribute('product-price');
      document.getElementById('productInfoDescription').innerHTML = data.description;
      
      var variants = data.variants;
      var variantSelect = document.getElementById('modalItemID');

      variantSelect.innerHTML = '';

      variants.forEach(function( variant, index ){
        console.log(variant);
        
        variantSelect.options[variantSelect.options.length] = new Option(variant.option1, variant.id);
      });

      productModal.show();
    });
   });
  });
}

var modalAddToCartForm = document.querySelector('#addToCartForm');

if(modalAddToCartForm != null) {
  modalAddToCartForm.addEventListener('submit', function(e) {
    e.preventDefault();
  
    let formData = {
      'items': [
        {
          'id': document.getElementById("modalItemID").value,
          'quantity': document.getElementById("modalItemQuantity").value
        }
      ]
    };
  
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      update_cart();
    })
    .catch((err) => {
      console.error('Error:' + err);
    });
  });
}

document.addEventListener('DOMContentLoaded', function(){
  update_cart();
});

function update_cart() {
  fetch('/cart.js')
  .then((resp) => resp.json())
  .then((data) => document.getElementById('numberOfCartItems').innerHTML = data.items.length)
  .catch((err) => console.error('err'));
}

var predictiveSearchInput = document.getElementById('searchInputField');
var timer;
var offcanvasSearch = document.getElementById('offcanvasSearchResult');
var bsOffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

if(predictiveSearchInput != null) {
  predictiveSearchInput.addEventListener('input', function(e) {

   clearTimeout(timer);

   if(predictiveSearchInput.value) {
      timer = setTimeout(fetchPredictiveSearch, 1000);
    }
  });
}

function fetchPredictiveSearch() {
  fetch(`/search/suggest.json?q=${predictiveSearchInput.value}&resources[type]=product`)
   .then(resp => resp.json())
   .then(data => {
     console.log(data);

     var products = data.resources.results.products;

     document.getElementById('search_results_body').innerHTML = '';

     products.forEach(function(product, index) {
       document.getElementById('search_results_body').innerHTML += `
         <div class="card" style="width: 19rem;">
           <img src="${product.image}" class="card-img-top">
           <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
           </div>
         </div>
       `
     });

     bsOffcanvas.show();
  });
}

$('.carousel').carousel({
  interval: 5000
})

var searchBar = document.getElementById("express-form-typeahead");
        searchBar.addEventListener('click' , function(){ 
            var closeSearch = document.getElementById("closeSearch");
            closeSearch.style.display = "block";
        });
        window.addEventListener('mouseup', e =>{
            //alert(e);
                if(e.target != searchBar && e.target.parentNode != searchBar )
                {
                    var closeSearch = document.getElementById("closeSearch");
                    closeSearch.style.display = "";
                }                  
        });