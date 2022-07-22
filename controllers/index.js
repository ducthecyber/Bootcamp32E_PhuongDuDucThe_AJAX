var arrProduct = [];
//----------GET: Lấy dữ liệu từ server về -----------------
console.log(axios);
function layDanhSachProductApi() {
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/GetAll',
        method: 'GET'
    });
    //Xử lý thành công
    promise.then(function (result) {
        console.log(result.data);
        //lấy dữ liệu dạng mảng từ server gán cho mảng product vừa tạo
        arrProduct = result.data;
        //kết quả trả ra object có vị trí "1" trong chuỗi Product
        //product: id, name, price,img, description
        console.log(arrProduct);
        renderTableProduct(result.data);
    })
    //xử lý thất bại
    promise.catch(function (err) {
        console.log(err.data)
    });
}

//------------------POST: Thêm dữ liệu vào server-------------
document.querySelector('#btnCreate').onclick = function () {
    //Cách 1: tạo object Product chứa các thuộc tính như object trong link, rồi tạo mới ở đây 
    var newProduct = new Product();
    newProduct.id = document.querySelector('#id').value;
    newProduct.name = document.querySelector('#name').value;
    newProduct.price = document.querySelector('#price').value;
    newProduct.img = document.querySelector('#image').value;
    newProduct.type = document.querySelector('#productType').value;
    newProduct.description = document.querySelector('#productDescription').value;

    //Cách 2: tạo object bằng cách tạo trực tiếp với thuộc tính theo object trong link
    // var newProduct2 = {
    //     id: document.querySelector('#id').value,
    //     name: document.querySelector('#name').value,
    //     price: document.querySelector('#price').value,
    //     img: document.querySelector('#image').value,
    //     type: document.querySelector('#productType').value,
    //     description: document.querySelector('#productDescription').value
    // }

    //gọi api đưa dữ liệu về backend
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/CreateProduct',
        method: 'POST',
        //dữ liệu gửi đi
        data: newProduct
    });

    promise.then(function (result) {
        console.log(result.data);
        //gọi lại api lấy danh sách product sau khi thêm thành công
        layDanhSachProductApi();
        //khởi tạo lại bảng product
        //renderTableProduct();
    });

    promise.catch(function (err) {
        console.log(err.data);
    });

}

//gọi hàm khi vừa load trang web
window.onload = function () {
    layDanhSachProductApi();
}

function renderTableProduct(arrProduct) {
    var html = '' //output: string html
    for (var i = 0; i < arrProduct.length; i++) {
        var item = arrProduct[i];
        html += `
    <tr>
        <td>${item.id}</td>
        <td>${item.img}</td>
        <td >${item.name}</td>
        <td>${item.price}</td>
        <td>${item.description}</td>
        <td>${item.type}</td>
        <td>
            <div class="row" >
                <button type="button" class="btn btn-danger" onclick="xoaProduct('${item.id}')">
                    <span class="fa-solid fa-trash-can" ></span>
                </button>
                <button type="button" class="btn btn-info" onclick="capNhatProduct('${item.id}')">
                    <span class="fa-solid fa-pen-to-square" ></span>
                </button> 
            </div>
        </td>
    </tr>
`
    }
    //đưa kết quả trả vào bảng
    document.querySelector('#tblProduct').innerHTML = html;
}

/**--------------DELETE------------- */
function xoaProduct(maProductClick) {
    alert(maProductClick);
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/DeleteProduct/' + maProductClick,
        method: 'DELETE'
    });
    //THANH CONG
    promise.then(function (result) {
        console.log(result.data);
        layDanhSachProductApi();
    });
    //that bai
    promise.catch(function (err) {
        console.log(err.data)
    });
}


//-------------CHINH SUA-------------
function capNhatProduct(id) {
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/GetById/' + id,
        method: 'GET'
    });
    //thanh cong
    promise.then(function (result) {
        var productMoi = result.data;
        console.log(result.data)
        document.querySelector('#id').value = productMoi.id;
        document.querySelector('#name').value = productMoi.name;
        document.querySelector('#price').value = productMoi.price;
        document.querySelector('#image').value = productMoi.img;
        document.querySelector('#productType').value = productMoi.type;
        document.querySelector('#productDescription').value = productMoi.description;
    });

    //that bai
    promise.catch(function (err) {
        console.log(err.data);
    });
}

//--------------PUT---------CAP NHAT DU LIEU----
document.querySelector('#btnUpdate').onclick = function () {
    var sanPhamMoi = new Product();
    //lay thong tin tu nguoi dung nhap lieu tren giao dien
    sanPhamMoi.id = document.querySelector('#id').value;
    sanPhamMoi.name = document.querySelector('#name').value;
    sanPhamMoi.img = document.querySelector('#image').value;
    sanPhamMoi.price = document.querySelector('#price').value;
    sanPhamMoi.type = document.querySelector('#productType').value;
    sanPhamMoi.description = document.querySelector('#productDescription').value;

    console.log(sanPhamMoi);
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/UpdateProduct/' + sanPhamMoi.id,
        method: 'PUT',
        data: sanPhamMoi
    });
    promise.then(function (result) {
        console.log(result.data);
        layDanhSachProductApi();
    })
    promise.catch(function (err) {
        console.log(err.data);
    });
}

/**----------------TÌM KIẾM SẢN PHẨM-----------------*/
var arrSanPhamTim = [];
document.querySelector('#btn_Find').onclick = function () {
    var tenSanPham = document.querySelector('#searchSanPham').value;
    console.log('ten san pham la', tenSanPham);
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/SearchByName?name=' + tenSanPham,
        method: 'GET'
    });

    //Thành công
    promise.then(function (result) {
        console.log(result.data);
        timSanPham(arrProduct, arrSanPhamTim, tenSanPham)
        //xóa cái tìm trước đó    
        // for (var index = 0; index < arrProduct.length; index++) {
        //     if (arrSanPhamTim[index] != '') {
        //         arrSanPhamTim.splice(index, arrSanPhamTim.length);
        //     }
        // }
        // //tạo cái mới
        // for (var index = 0; index < arrProduct.length; index++) {
        //     var sanPhamTim = arrProduct[index];
        //     if (sanPhamTim.name === tenSanPham) {
        //         arrSanPhamTim.push(sanPhamTim);
        //     }
        // }
        renderTableProduct(arrSanPhamTim);
    });
    //thất bại
    promise.catch(function (err) {
        console.log(err);
    });
}

function timSanPham(arrList, arrFind, itemName) {
    for (var index = 0; index < arrList.length; index++) {
        if (arrFind[index] != '') {
            arrFind.splice(index, arrFind.length);
        }
    }
    //tạo cái mới
    for (var index = 0; index < arrList.length; index++) {
        var sanPhamTim = arrList[index];
        if (sanPhamTim.name === itemName) {
            arrFind.push(sanPhamTim);
        }
    }
}