// API Configuration
const API_URL = 'https://www.themealdb.com/api/json/v1/1';

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const categoriasGrid = document.getElementById('categoriasGrid');
const recetasGrid = document.getElementById('recetasGrid');
const favoritosGrid = document.getElementById('favoritosGrid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

// State
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

// Event Listeners
menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
searchBtn.addEventListener('click', buscarRecetas);
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && buscarRecetas());
modalClose.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => e.target === modal && cerrarModal());

// Initialize
cargarCategorias();
cargarRecetasAleatorias();
renderizarFavoritos();

// API Functions
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function cargarCategorias() {
    const data = await fetchAPI('categories.php');
    if (data?.categories) {
        categoriasGrid.innerHTML = data.categories.slice(0, 8).map(cat => `
            <div class="categoria-card" onclick="cargarPorCategoria('${cat.strCategory}')">
                <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
                <h3>${cat.strCategory}</h3>
            </div>
        `).join('');
    }
}

async function cargarRecetasAleatorias() {
    recetasGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Loading...</p>';
    const recetas = [];
    for (let i = 0; i < 8; i++) {
        const data = await fetchAPI('random.php');
        if (data?.meals) recetas.push(data.meals[0]);
    }
    renderizarRecetas(recetas, recetasGrid);
}

async function cargarPorCategoria(categoria) {
    const data = await fetchAPI(`filter.php?c=${categoria}`);
    if (data?.meals) {
        recetasGrid.innerHTML = '';
        window.location.hash = 'recetas';
        renderizarRecetas(data.meals.slice(0, 12), recetasGrid);
    }
}

async function buscarRecetas() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    const data = await fetchAPI(`search.php?s=${query}`);
    recetasGrid.innerHTML = '';
    
    if (data?.meals) {
        renderizarRecetas(data.meals, recetasGrid);
        window.location.hash = 'recetas';
    } else {
        recetasGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No recipes found</p>';
    }
}

async function verDetalle(id) {
    const data = await fetchAPI(`lookup.php?i=${id}`);
    if (data?.meals) {
        const meal = data.meals[0];
        const ingredientes = [];
        
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const med = meal[`strMeasure${i}`];
            if (ing && ing.trim()) ingredientes.push(`${med} ${ing}`);
        }
        
        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="modal-body">
                <h2>${meal.strMeal}</h2>
                <div class="modal-tags">
                    <span class="tag">${meal.strCategory}</span>
                    <span class="tag">${meal.strArea}</span>
                </div>
                <div class="ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                        ${ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div class="instructions">
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
}

function cerrarModal() {
    modal.classList.remove('active');
}

// Render Functions
function renderizarRecetas(recetas, container) {
    container.innerHTML = recetas.map(meal => {
        const esFavorito = favoritos.some(f => f.idMeal === meal.idMeal);
        return `
            <div class="receta-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="receta-info">
                    <h3>${meal.strMeal}</h3>
                    <p>${meal.strCategory || 'Category'} • ${meal.strArea || 'International'}</p>
                    <div class="receta-actions">
                        <button class="btn btn-primary" onclick="verDetalle('${meal.idMeal}')">View Recipe</button>
                        <button class="btn btn-secondary" onclick="toggleFavorito('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">
                            ${esFavorito ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderizarFavoritos() {
    if (favoritos.length === 0) {
        favoritosGrid.innerHTML = '<p class="empty-message">No favorites yet</p>';
        return;
    }
    
    favoritosGrid.innerHTML = favoritos.map(meal => `
        <div class="receta-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="receta-info">
                <h3>${meal.strMeal}</h3>
                <div class="receta-actions">
                    <button class="btn btn-primary" onclick="verDetalle('${meal.idMeal}')">View Recipe</button>
                    <button class="btn btn-secondary" onclick="toggleFavorito('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Favorites Management
function toggleFavorito(id, nombre, imagen) {
    const index = favoritos.findIndex(f => f.idMeal === id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push({ idMeal: id, strMeal: nombre, strMealThumb: imagen });
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    renderizarFavoritos();
    cargarRecetasAleatorias();
}
