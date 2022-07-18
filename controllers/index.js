var product = [];
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
        //lấy dữ liệu dạng mảng từ server gán cho mảng arrProduct vừa tạo
        product = result.data;
        //kết quả trả ra object có vị trí "1" trong chuỗi Product
        //product: id, name, price,img, description
        console.log(product[1]);
        renderTableProduct(result.data);
    })
    //xử lý thất bại
    promise.catch(function (err) {
        console.log(err.data)
    });
}


//------------------POST: Thêm dữ liệu vào server-------------
document.querySelector('#btnCreate').onclick = function () {
    product.id = document.querySelector('#id').value;
    product.name = document.querySelector('#name').value;
    product.price = document.querySelector('#price').value;
    product.img = document.querySelector('#image').value;
    product.type = document.querySelector('#productType').value;
    product.description = document.querySelector('#productDescription').value;

    console.log(product);
    //gọi api đưa dữ liệu về backend
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/CreateProduct',
        method: 'POST',
        //dữ liệu gửi đi
        data: product
    });
    promise.then(function (result) {
        console.log(result.data);
        //gọi lại api lấy danh sách product sau khi thêm thành công
        layDanhSachProductApi();
        //khởi tạo lại bảng product
        renderTableProduct();
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
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.description}</td>
        <td>${item.type}</td>
        <td>
            <div class="row" style="display:flex">
                <button type="button" class="btn btn-danger">
                    <span class="fa-solid fa-trash-can"></span>
                </button>
                <button type="button" class="btn btn-info">
                    <span class="fa-solid fa-pen-to-square"></span>
                </button> 
            </div>
        </td>
    </tr>
`
    }
    //đưa kết quả trả vào bảng
    document.querySelector('#tblProduct').innerHTML = html;
}

