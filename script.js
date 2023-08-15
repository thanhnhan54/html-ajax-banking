let id = 1;
let customerId = 0;
let customer = {};
let currentPage = 1;
let totalPages = 1;
function renderCustomer(obj) {
    return `
            <tr id="tr_${obj.id}">
                <td>${obj.id} </td>
                <td>${obj.fullName} </td>
                <td>${obj.email} </td>
                <td>${obj.phone} </td>
                <td>${obj.address} </td>
                <td>${obj.balance}</td>
                <td>
                    <button  class="btn btn-outline-secondary edit" data-id="${obj.id}" >
                            <i class="far fa-edit"></i>
                    </button>
                    <button  class="btn btn-outline-success deposit" data-id="${obj.id}">
                                <i class="fas fa-plus"></i>
                    </button>
                    <button  class="btn btn-outline-warning withdraw" data-id="${obj.id}">
                            <i class="fa fa-minus"></i>
                    </button>
                    <button  class="btn btn-outline-primary transfer" data-id="${obj.id}">
                            <i class="fas fa-exchange-alt" ></i>
                    </button>
                    <button  class="btn btn-outline-danger delete" data-id="${obj.id}" >
                            <i class="fas fa-ban" ></i>
                    </button>
                </td>
            </tr>`;

}

function getAllCustomers() {
    const tbCustomerBody = $("#tbCustomer tbody");
    tbCustomerBody.empty();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3300/customers'
    })
        .done((data) => {
            data.forEach(item => {
                const str = renderCustomer(item);
                tbCustomerBody.prepend(str);
            });

            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();
        })
        .fail((error) => {
            console.log(error);
        })
}
getAllCustomers();


/******************** Create *************************/

function handleCreate() {
    const btnCreate = $("#btnCreate");
    btnCreate.on("click", function () {

        const fullName = $("#fullNameCreate").val();
        const email = $("#emailCreate").val();
        const phone = $("#phoneCreate").val();
        const address = $("#addressCreate").val();
        const balance = 0;
        const deleted = 0;

        const obj = {
            fullName,
            email,
            phone,
            address,
            balance,
            deleted
        };

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: "POST",
            url: "http://localhost:3300/customers",
            data: JSON.stringify(obj)
        })
            .done((data) => {
                const str = renderCustomer(data);
                const tbCustomerBody = $('#tbCustomer tbody');
                tbCustomerBody.append(str);

                $('#modalCreate').modal('hide');


                addEventShowModalUpdate();
                addEventShowModalDeposit();
                addEventShowModalWithdraw();
                addEventDeleteCustomer();

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Thêm khách hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .fail((error) => {
                console.log(error);
            });

    });
}
handleCreate()

/******************** Find *************************/

function getCustomerById(id) {
    return $.ajax({
        type: 'GET',
        url: 'http://localhost:3300/customers/' + id,
    });
}
/******************** Show Modal *************************/

function addEventShowModalUpdate() {
    let btnEdit = $(".edit");
    btnEdit.off('click');
    btnEdit.on('click', function () {
        customerId = $(this).data('id');

        const modalUpdate = $('#modalUpdate');

        getCustomerById(customerId).then((data) => {
            $("#fullNameUpdate").val(data.fullName);
            $("#emailUpdate").val(data.email);
            $("#phoneUpdate").val(data.phone);
            $("#addressUpdate").val(data.address);

            modalUpdate.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
    });

}

function addEventShowModalDeposit() {
    let btnDeposit = $(".deposit");
    btnDeposit.on("click", function () {
        customerId = $(this).data('id');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#idDeposit").val(customer.id);
            $("#fullNameDeposit").val(customer.fullName);
            $("#emailDeposit").val(customer.email);
            $("#balanceDeposit").val(customer.balance);
            $("#transactionDeposit").val(0);

            $("#modalDeposit").modal('show')
        })
            .catch((error) => {
                console.log(error);
            });

    })
}

function addEventShowModalWithdraw() {
    let btnWithdraw = $(".withdraw");
    btnWithdraw.off('click');
    btnWithdraw.on("click", function () {
        customerId = $(this).data('id');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#idWithdraw").val(customer.id);
            $("#fullNameWithdraw").val(customer.fullName);
            $("#emailWithdraw").val(customer.email);
            $("#balanceWithdraw").val(customer.balance);
            $("#transactionWithdraw").val(0);

            $("#modalWithdraw").modal('show');
        })
            .catch((error) => {
                console.log(error);
            });

    })
}

/******************** Update *************************/


function handleUpdateCustomer() {
    const btnUpdate = $('#btnUpdate');
    btnUpdate.on('click', () => {

        const fullName = $('#fullNameUpdate').val();
        const email = $('#emailUpdate').val();
        const phone = $('#phoneUpdate').val();
        const address = $('#addressUpdate').val();

        const obj = {
            fullName,
            email,
            phone,
            address
        }

        update(obj);
    })
}
handleUpdateCustomer()

function update(obj) {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3300/customers/' + customerId,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = renderCustomer(data);

            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);

            $('#modalUpdate').modal('hide');

            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();

            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Đã cập nhật thông tin',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((error) => {
            console.log(error);
        })
}

/******************** Deposit *************************/
function addEventShowModalDeposit() {
    let btnDeposit = $('.deposit');
    btnDeposit.on('click', function () {
        customerId = $(this).data('id');
        const modalDeposit = $('#modalDeposit');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $('#fullNameDeposit').val(customer.fullName);
            $('#emailDeposit').val(customer.email);
            $('#balanceDeposit').val(customer.balance);

            modalDeposit.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
    })
}
const btnDeposit = $('#btnDeposit');
btnDeposit.on('click', () => {
    const transactionAmount = parseFloat($('#transactionDeposit').val());

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
        $('#Deposit-error').text('Vui lòng nhập số tiền hợp lệ.');
        return;
    }
    $('#transactionDeposit').val('');
    const currentBalance = customer.balance;
    console.log(currentBalance);

    const newBalance = currentBalance + transactionAmount;
    console.log("newBalance", newBalance);
    console.log("currentBalance", currentBalance);
    console.log("transactionAmount", transactionAmount);
    customer.balance = newBalance;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3300/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);
            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();
            $('#modalDeposit').modal('hide');

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Nạp tiền thành công',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((error) => {
            console.log(error);
        })


    const obj = {
        customerId,
        transactionAmount
    }

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3300/deposits',
        data: JSON.stringify(obj)
    })
        .done((data) => {

        })
        .fail((error) => {
            console.log(error);
        })
})


/******************** Withdraw *************************/
function addEventShowModalWithdraw() {
    let btnWithdraw = $('.withdraw');
    btnWithdraw.on('click', function () {
        customerId = $(this).data('id');
        const modalWithdraw = $('#modalWithdraw');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $('#fullNameWithdraw').val(customer.fullName);
            $('#emailWithdraw').val(customer.email);
            $('#balanceWithdraw').val(customer.balance);

            modalWithdraw.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
    })
}
const btnWithdraw = $('#btnWithdraw');
btnWithdraw.on('click', () => {
    const transactionAmount = parseFloat($('#transactionWithdraw').val());

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
        $('#withdraw-error').text('Vui lòng nhập số tiền hợp lệ.');
        return;
    }
    const currentBalance = customer.balance;
    $('#transactionWithdraw').val('');
    const newBalance = currentBalance - transactionAmount;
    customer.balance = newBalance;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3300/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);
            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();
            $('#modalWithdraw').modal('hide');

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Nạp tiền thành công',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((error) => {
            console.log(error);
        })


    const obj = {
        customerId,
        transactionAmount
    }

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3300/withdraws',
        data: JSON.stringify(obj)
    })
        .done((data) => {

        })
        .fail((error) => {
            console.log(error);
        })
})




/******************** Delete *************************/


function addEventDeleteCustomer() {
    const btnDelete = $(".delete");
    btnDelete.off('click');
    btnDelete.on('click', function () {
        customerId = $(this).data('id');
        let cf = confirm('Bạn chắc chắn muốn xoá?');
        if (cf) {

            $.ajax({
                type: 'PATCH',
                url: "http://localhost:3300/customers/" + customerId,
                data: {
                    deleted: 1
                }
            })
                .done(() => {
                    $('#tr_' + customerId).remove();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Xoá thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        }
    });
}
/******************** Transfer *************************/

function addEventShowModalTransfer() {
    let btnTransfer = $('.transfer');
    btnTransfer.on('click', function () {
        customerId = $(this).data('id');
        const modalTransfer = $('#modalTransfer');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $('#senderId').val(customer.id);
            $('#senderFullName').val(customer.fullName);
            $('#senderEmail').val(customer.email);
            $('#senderBalance').val(customer.balance);

            $.ajax({
                type: 'GET',
                url: 'http://localhost:3300/customers'
            })
                .done((data) => {
                    const recipientSelect = $('#recipientId');
                    recipientSelect.empty();

                    data.forEach(item => {
                        if (item.id !== customer.id) {
                            recipientSelect.append($('<option>', {
                                value: item.id,
                                text: item.fullName
                            }));
                        }
                    });
                })
                .fail((error) => {
                    console.log(error);
                });

            modalTransfer.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
    });
}

addEventShowModalTransfer();

$('#transferAmount').on('change', function () {
    const transferAmount = parseFloat($(this).val());
    const fees = parseFloat($('#fees').val());
    const totalAmount = transferAmount + (transferAmount * (fees / 100));

    $('#transactionAmount').val(totalAmount.toFixed(2));
});

$('#recipientId').on('change', function () {
    $('#transfer-name-error').text('');
    $('#transferAmount').trigger('change');
});

const btnTransferSubmit = $('#btnTransfer');
btnTransferSubmit.on('click', () => {
    const transferAmount = parseFloat($('#transferAmount').val());

    if (isNaN(transferAmount) || transferAmount <= 0) {
        $('#transfer-error').text('Số tiền chuyển phải là một số dương.');
        return;
    }

    const recipientId = $('#recipientId').val();
    const senderBalance = parseFloat($('#senderBalance').val());

    if (transferAmount > senderBalance) {
        $('#transfer-error').text('Số tiền chuyển không được lớn hơn số dư của người gửi.');
        return;
    }

    const transactionObj = {
        senderId: customer.id,
        recipientId,
        amount: transferAmount
    };

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3300/transfer',
        data: JSON.stringify(transactionObj)
    })
        .done((data) => {
            customer.balance -= transferAmount;
            $('#senderBalance').val(customer.balance.toFixed(2));

            const recipientBalance = parseFloat($('#balance_' + recipientId).text());
            $('#balance_' + recipientId).text((recipientBalance + transferAmount).toFixed(2));

            $('#modalTransfer').modal('hide');

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Chuyển tiền thành công',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .fail((error) => {
            console.log(error);
        });
});
// $(document).ready(function () {

//     const recordsPerPage = 5; // Number of records displayed per page

//     function renderCustomers(data) {
//         const tbCustomerBody = $("#customerRows");
//         tbCustomerBody.empty();

//         data.forEach(item => {
//             const str = renderCustomer(item);
//             tbCustomerBody.append(str);
//         });
//     }

//     function updatePaginationButtons(totalPages) {
//         $("#currentPage").empty();
//         for (let i = 1; i <= totalPages; i++) {
//             const pageButton = $(`<button class="btn btn-outline-primary">${i}</button>`);
//             pageButton.on("click", function () {
//                 currentPage = i;
//                 fetchCustomersWithPagination();
//             });
//             $("#currentPage").append(pageButton);
//         }
//         $("#prevPage").prop("disabled", currentPage === 1);
//         $("#nextPage").prop("disabled", currentPage === totalPages);
//     }

//     function fetchCustomersWithPagination() {
//         const startIndex = (currentPage - 1) * recordsPerPage;

//         $.ajax({
//             type: 'GET',
//             url: `http://localhost:3300/customers?_start=${startIndex}&_limit=${recordsPerPage}`
//         })
//             .done((data, textStatus, xhr) => {
//                 const totalRecords = xhr.getResponseHeader('X-Total-Count');
//                 const totalPages = Math.ceil(totalRecords / recordsPerPage);

//                 renderCustomers(data);
//                 updatePaginationButtons(totalPages);
//             })
//             .fail((error) => {
//                 console.log(error);
//             });
//     }

//     $("#prevPage").on("click", function () {
//         if (currentPage > 1) {
//             currentPage--;
//             fetchCustomersWithPagination();
//         }
//     });

//     $("#nextPage").on("click", function () {
//         currentPage++;
//         fetchCustomersWithPagination();
//     });

//     fetchCustomersWithPagination();
// });