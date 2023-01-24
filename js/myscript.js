// preloader
window.onload = function () {
    document.querySelector(".loader").classList.add("fade-out");
    document.body.style.overflow = "auto"

}
//==============================
//define inputs
let prductName = document.querySelector('#nameInput')
let price = document.querySelector('#priceInput')
let taxes = document.querySelector('#taxesInput')
let ads = document.querySelector('#adsInput')
let discount = document.querySelector('#discountInput')
let total = document.querySelector('#totalInput')
let count = document.querySelector('#countInput')
let category = document.querySelector('#categoryInput')
let totalInputs = document.querySelectorAll('.totalInputs')
//============================
//define buttons
let submitButton = document.querySelector('#submit')
let deleteAllButton = document.querySelector('#deleteAll')
let searchCategoryButton = document.querySelector('#searchCategory')
let searchNameButton = document.querySelector('#searchName')
//================================
const totalAlert = document.querySelector('#totalAlert')
const alert = document.querySelector('#alert')
let tbody = document.querySelector('#tbody')
let temp
let search = document.querySelector('#search')
let searchMood = "productName"
let resetSearch = document.querySelector(".close-btn")
let error = false //true:There is error
//====================================================
//start application
let productData
if (localStorage.product == null) {
    productData = []
} else {
    productData = JSON.parse(localStorage.product)
}
searchNameButton.classList.add("search-type-active")
showData()
//====================================================
//calc total
function calcTotal() {
    if (price.value != "") {
        error = false
        totalAlert.style = "display:none !important"
        if (price.value >= 0) {
            error = false
            alert.style = "display:none !important"
            total.value = ((+price.value + +taxes.value + +ads.value - +discount.value).toLocaleString())
            total.previousElementSibling.style = "background-color:green;"
            totalAlert.style = "display:none !important"
        } else {
            error = true
            totalAlert.children[1].innerHTML="Please Enter Positive Price"
            totalAlert.style = "display:flex !important"
            total.previousElementSibling.style = "background-color:red;"
            total.value = ((+price.value + +taxes.value + +ads.value - +discount.value).toLocaleString())
        }
    } else {
        error = true
        totalAlert.children[1].innerHTML="Please Enter Price"
        totalAlert.style = "display:flex !important"
        total.previousElementSibling.style = "background-color:red;"
        total.value = ((+price.value + +taxes.value + +ads.value - +discount.value).toLocaleString())
    }
}
totalInputs.forEach(input => {
    input.addEventListener('change',() => {
        calcTotal()
    })
})
//create an update product
submitButton.addEventListener('click',() => {
    if (prductName.value != "" && price.value != "" && category.value != "") {
        if (alert.style.display == "flex" && alert.children[1].innerHTML == "Please enter product name, price and category") {
            alert.style = "display:none !important"
        }
        let newProduct = {
            name: prductName.value,
            price: (price.value),
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            count: count.value,
            total: total.value,
            category: category.value,
        }
        if (newProduct.taxes == "") {
            newProduct.taxes = 0
        }
        if (newProduct.ads == "") {
            newProduct.ads = 0
        }
        if (newProduct.discount == "") {
            newProduct.discount = 0
        }
        if (newProduct.count == "") {
            newProduct.count = 1
        }
        if (error == false) {
            if (newProduct.count > 0) {
                if (alert.style.display == "flex" && alert.children[1].innerHTML == "Please enter positive value in count") {
                    alert.style = "display:none !important"
                }
                if (submitButton.innerHTML == "Create") {
                    productData.push(newProduct)
                    localStorage.setItem('product',JSON.stringify(productData))
                    clearInputs()
                    showData()
                }
                else {
                    productData[temp] = newProduct
                    localStorage.setItem('product',JSON.stringify(productData))
                    clearInputs()
                    showData()
                    submitButton.innerHTML = "Create"
                }
            } else {

                alert.children[1].innerHTML = "Please enter positive value in count"
                alert.style = "display:flex !important"

            }
        }
    } else {
        alert.children[1].innerHTML = "Please enter product name, price and category"
        alert.style = "display:flex !important"
    }
})
//clear data
function clearInputs() {
    prductName.value = ""
    price.value = ""
    ads.value = ""
    taxes.value = ""
    discount.value = ""
    total.value = ""
    category.value = ""
    count.value = ""
    total.previousElementSibling.style = "background-color:red;"
}
//show data
function showData() {
    deleteAllButton.innerHTML = `Delete All ${productData.length}`
    tbody.innerHTML = "";
    for (i = 0; i < productData.length; i++) {
        tbody.innerHTML +=
            `<tr>
        <th scope="row">${i + 1}</th>
        <td>${productData[i].name}</td>
        <td>${productData[i].price}</td>
        <td>${productData[i].taxes}</td>
        <td>${productData[i].ads}</td>
        <td>${productData[i].discount}</td>
        <td>${productData[i].total}</td>
        <td>${productData[i].category}</td>
        <td>${productData[i].count}</td>
        <td><button class="table-btn" onclick="updateData(${i})">Update</button></td>
        <td><button class="table-btn" onclick="deleteModal(${i})" data-bs-toggle="modal" data-bs-target="#deletePopup">Delete</button></td>
        </tr>`
    }


}
//delete all
deleteAllButton.onclick = function () {
    deleteAll()
}

function deleteAll() {
    localStorage.clear()
    productData = []
    showData()
}
//delete item
let deleteInput = document.querySelector('#deleteInput')
let modalDelete = document.querySelector('#modalDelete')
let modalDeleteAll = document.querySelector('#modalDeleteAll')


function deleteModal(i) {
    clearInputs()
    showData()
    submitButton.innerHTML = "Create"
    temp = i
    deleteInput.nextElementSibling.innerHTML = `You have ${productData[i].count} ${productData[i].name}s`
    deleteInput.addEventListener("change",function () {
        let v = parseInt(this.value);
        if (v < 0) this.value = 1;
        if (v > productData[i].count) this.value = productData[i].count;
    });
}
modalDelete.addEventListener("click",() => {
    if (deleteInput.value == productData[temp].count) {
        productData.splice(temp,1)
    }
    else {
        if (deleteInput.value > 0) {
            productData[temp].count -= deleteInput.value
        }
        else {
            productData[temp].count -= 1
        }
    }
    localStorage.setItem('product',JSON.stringify(productData))
    showData()
})
modalDeleteAll.addEventListener("click",() => {
    productData.splice(temp,1)
    localStorage.setItem('product',JSON.stringify(productData))
    showData()
})
//update data
function updateData(i) {
    prductName.value = productData[i].name
    price.value = productData[i].price
    taxes.value = productData[i].taxes
    ads.value = productData[i].ads
    discount.value = productData[i].discount
    category.value = productData[i].category
    count.value = productData[i].count
    calcTotal()
    submitButton.innerHTML = "Update"
    temp = i
}
//search Data
searchNameButton.addEventListener('click',() => {
    search.focus()
    searchNameButton.classList.add("search-type-active")
    searchCategoryButton.classList.remove("search-type-active")
    searchMood = "productName"
    searchData(search.value)
})
searchCategoryButton.addEventListener('click',() => {
    search.focus()
    searchNameButton.classList.remove("search-type-active")
    searchCategoryButton.classList.add("search-type-active")
    searchMood = "productCategory"
    searchData(search.value)
})
resetSearch.addEventListener("click",() => {
    search.value = ""
    showData()
    search.focus()
})

search.onkeyup = () => {
    searchData(search.value)
}

function searchData(value) {
    tbody.innerHTML = "";
    if (searchMood == "productName") {
        for (i = 0; i < productData.length; i++) {
            if (productData[i].name.includes(value)) {
                tbody.innerHTML +=
                    `<tr>
                <th scope="row">${i + 1}</th>
                <td>${productData[i].name}</td>
                <td>${productData[i].price}</td>
                <td>${productData[i].taxes}</td>
                <td>${productData[i].ads}</td>
                <td>${productData[i].discount}</td>
                <td>${productData[i].total}</td>
                <td>${productData[i].category}</td>
                <td>${productData[i].count}</td>
                <td><button class="table-btn" onclick="updateData(${i})">Update</button></td>
                <td><button class="table-btn" onclick="deleteModal(${i})" data-bs-toggle="modal" data-bs-target="#deletePopup">Delete</button></td>
                </tr>`
            }
        }
    } else {
        for (i = 0; i < productData.length; i++) {
            if (productData[i].category.includes(value)) {
                tbody.innerHTML +=
                    `<tr>
                <th scope="row">${i + 1}</th>
                <td>${productData[i].name}</td>
                <td>${productData[i].price}</td>
                <td>${productData[i].taxes}</td>
                <td>${productData[i].ads}</td>
                <td>${productData[i].discount}</td>
                <td>${productData[i].total}</td>
                <td>${productData[i].category}</td>
                <td>${productData[i].count}</td>
                <td><button class="table-btn" onclick="updateData(${i})">Update</button></td>
                <td><button class="table-btn" onclick="deleteModal(${i})" data-bs-toggle="modal" data-bs-target="#deletePopup">Delete</button></td>
                </tr>`
            }
        }
    }
}