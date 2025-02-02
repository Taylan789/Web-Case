let currentStep = 0;
let selectedAnswers = {};
let questions = [];
let products = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data[0]?.steps || [];
            loadStep();
        });

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
        });
});

function loadStep() {
    if (!questions[currentStep]) return;
    const stepData = questions[currentStep];
    document.getElementById('question-title').innerText = stepData.title;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    stepData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.onclick = () => selectAnswer(answer);
        if (selectedAnswers[currentStep] === answer) {
            button.classList.add('selected');
        }
        answersContainer.appendChild(button);
    });

    document.getElementById('prev').disabled = currentStep === 0;
    document.getElementById('next').disabled = !selectedAnswers.hasOwnProperty(currentStep);
}

function selectAnswer(answer) {
    selectedAnswers[currentStep] = answer;
    loadStep();
}

document.getElementById('prev').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        loadStep();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentStep < questions.length - 1) {
        currentStep++;
        loadStep();
    } else {
        showProducts();
    }
});

function showProducts() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('products-container').style.display = 'block';
    const productList = document.getElementById('products');
    productList.innerHTML = '';

    const filteredProducts = products.filter(product =>
        product.category.some(cat => cat.toLowerCase().includes(selectedAnswers[0]?.toLowerCase())) &&
        product.colors.some(color => color.toLowerCase().includes(selectedAnswers[1]?.toLowerCase()))
    );

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p>No Products Found</p>';
    } else {
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `<img src="${product.image}" loading="lazy" alt="${product.name}">
                                    <p>${product.name}</p>
                                    <p>${product.priceText}</p>`;
            productList.appendChild(productDiv);
        });
    }
}

document.getElementById('product-prev').addEventListener('click', () => {
    document.getElementById('products-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
});

document.getElementById('product-next').addEventListener('click', () => {
    alert('Order Completed!');
});

document.getElementById('slide-left').addEventListener('click', () => {
    document.getElementById('products').scrollBy({ left: -300, behavior: 'smooth' });
});

document.getElementById('slide-right').addEventListener('click', () => {
    document.getElementById('products').scrollBy({ left: 300, behavior: 'smooth' });
});