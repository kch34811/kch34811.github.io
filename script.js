// 이미지 슬라이더와 페이지 인디케이터 동작 구현
const sliderWrapper = document.querySelector('.slider-wrapper');
const images = document.querySelectorAll('.slider-wrapper img');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
let currentIndex = 1;
let isTransitioning = false;

function updateSliderPosition() {
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function showImage(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
    currentIndex = index;
    updateSliderPosition();
    sliderWrapper.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            sliderWrapper.style.transition = 'none';
            currentIndex = images.length - 2; // 마지막 이미지로 점프
            updateSliderPosition();
        }
        if (currentIndex === images.length - 1) {
            sliderWrapper.style.transition = 'none';
            currentIndex = 1; // 첫 번째 이미지로 점프
            updateSliderPosition();
        }
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex - 1);
        });
        isTransitioning = false;
    }, { once: true });
}

function nextImage() {
    showImage(currentIndex + 1);
}

function prevImage() {
    showImage(currentIndex - 1);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showImage(index + 1);
    });
});

rightArrow.addEventListener('click', nextImage);
leftArrow.addEventListener('click', prevImage);

// 모바일에서 터치 슬라이드를 통해 이미지 넘기기
let startX = 0;
let isDragging = false;

sliderWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    sliderWrapper.style.transition = 'none';
});

sliderWrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const moveX = currentX - startX;
    sliderWrapper.style.transform = `translateX(calc(-${currentIndex * 100}% + ${moveX}px))`;
});

sliderWrapper.addEventListener('touchend', (e) => {
    isDragging = false;
    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    if (diffX > 50) {
        nextImage();
    } else if (diffX < -50) {
        prevImage();
    } else {
        updateSliderPosition();
    }
});

// 기본 이미지 표시
updateSliderPosition();

// 다음 우편번호 서비스 API를 사용하여 주소를 검색하고 입력 필드에 자동으로 채워줍니다.
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            // 사용자가 선택한 주소 유형에 따라 도로명 주소와 지번 주소를 구분합니다.
            if (data.userSelectedType === 'R') { 
                addr = data.roadAddress;
            } else { 
                addr = data.jibunAddress;
            }

            // 참고항목을 추가로 작성합니다. (예: 아파트 명 등)
            if(data.userSelectedType === 'R'){
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                addr += extraAddr; // 참고항목을 주소에 추가합니다.
            }

            // 우편번호와 주소 정보를 해당 필드에 입력합니다.
            document.getElementById('sample6_postcode').value = data.zonecode;
            document.getElementById("sample6_address").value = addr;
            
            // 상세주소 필드로 포커스를 이동합니다.
            document.getElementById("sample6_detailAddress").focus();
        }
    }).open();
}

// 구매하기 버튼을 눌렀을 때 주문 폼을 보여주고, 구매 배너를 숨깁니다.
function showForm() {
    document.querySelector('.buy-banner').style.display = 'none';
    document.getElementById('reservation-form').style.display = 'block';
    setTimeout(function() {
        document.getElementById('reservation-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 주문자 정보와 배송 정보가 동일할 경우 배송 정보를 자동으로 채워줍니다.
document.getElementById('same-as-order').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('recipient-name').value = document.getElementById('order-name').value;
        document.getElementById('recipient-phone').value = document.getElementById('order-phone').value;
    } else {
        document.getElementById('recipient-name').value = '';
        document.getElementById('recipient-phone').value = '';
    }
});

// 폼 제출 시 데이터를 서버로 전송합니다.
document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const recipientName = document.getElementById('recipient-name').value;
    const recipientPhone = document.getElementById('recipient-phone').value;
    const postcode = document.getElementById('sample6_postcode').value;
    const address = document.getElementById('sample6_address').value;
    const detailAddress = document.getElementById('sample6_detailAddress').value;
    const extraAddress = document.getElementById('sample6_extraAddress').value;
    const quantity = document.getElementById('quantity').value;

    fetch('https://script.google.com/macros/s/AKfycbxF7LAt3jgpnjyL4lt79sbzPjO4ZbDvQiyo_hBzJFIdd7PXPWEeVXJujB5nLASfvxCg/exec', {
        method: 'POST',
        body: JSON.stringify({
            name, 
            phone, 
            recipientName,
            recipientPhone,
            postcode, 
            address, 
            detailAddress, 
            extraAddress, 
            quantity
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('예약이 성공적으로 완료되었습니다.');
        } else {
            alert('예약에 실패했습니다. 다시 시도해 주세요.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('예약에 실패했습니다. 다시 시도해 주세요.');
    });
});

// 연락처 입력란에서 숫자 키패드가 나타나도록 설정
document.getElementById('order-phone').setAttribute('type', 'tel');
document.getElementById('recipient-phone').setAttribute('type', 'tel');
