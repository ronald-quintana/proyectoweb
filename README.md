# 🍳 Cocina Gourmet - Proyecto Web

Aplicación web moderna para explorar recetas de cocina de todo el mundo, utilizando la API de TheMealDB.

## 📋 Características

- ✅ Búsqueda de recetas por nombre
- ✅ Navegación por categorías
- ✅ Visualización detallada de recetas
- ✅ Sistema de favoritos con LocalStorage
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Modal interactivo para detalles
- ✅ Integración con API externa

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño avanzado con Flexbox y Grid
- **JavaScript ES6+**: Lógica e interactividad
- **TheMealDB API**: Datos de recetas

## 📁 Estructura del Proyecto

```
/
├── index.html      # Estructura HTML semántica
├── style.css       # Estilos CSS con Flexbox/Grid
├── script.js       # Lógica JavaScript y API
└── README.md       # Documentación
```

## 🎨 HTML - Estructura Semántica

### Elementos Principales

```html
<header>    - Navegación principal
<main>      - Contenido principal
<section>   - Secciones temáticas (hero, categorías, recetas, favoritos)
<aside>     - Modal para detalles
<footer>    - Pie de página
```

### Secciones

1. **Hero**: Presentación y buscador
2. **Categorías**: Grid de categorías de comida
3. **Recetas**: Grid de recetas populares
4. **Favoritos**: Recetas guardadas por el usuario
5. **Modal**: Detalles completos de receta

## 🎨 CSS - Diseño Avanzado

### Variables CSS

```css
--primary: #ff6b35    /* Color principal */
--secondary: #f7931e  /* Color secundario */
--dark: #1a1a2e       /* Texto oscuro */
--light: #f5f5f5      /* Fondo claro */
```

### Técnicas Utilizadas

#### 1. **Flexbox**
- Navegación horizontal
- Alineación de elementos en cards
- Botones de acción

```css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

#### 2. **CSS Grid**
- Layout de categorías (auto-fit)
- Grid de recetas (auto-fill)
- Grid de ingredientes

```css
.recetas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}
```

#### 3. **Responsive Design**

**Breakpoints:**
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: < 480px

```css
@media (max-width: 768px) {
    .nav-menu { display: none; }
    .menu-toggle { display: block; }
}
```

#### 4. **Efectos y Transiciones**

```css
.receta-card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s;
}
```

## 💻 JavaScript - Interactividad

### Arquitectura

```javascript
// Configuración
API_URL = 'https://www.themealdb.com/api/json/v1/1'

// Estado
favoritos = localStorage

// Funciones principales
- cargarCategorias()
- cargarRecetasAleatorias()
- buscarRecetas()
- verDetalle()
- toggleFavorito()
```

### Consumo de API

#### Endpoints Utilizados

1. **Categorías**
```javascript
GET /categories.php
// Retorna todas las categorías
```

2. **Recetas Aleatorias**
```javascript
GET /random.php
// Retorna una receta aleatoria
```

3. **Búsqueda**
```javascript
GET /search.php?s={query}
// Busca recetas por nombre
```

4. **Filtrar por Categoría**
```javascript
GET /filter.php?c={categoria}
// Filtra recetas por categoría
```

5. **Detalle de Receta**
```javascript
GET /lookup.php?i={id}
// Obtiene detalles completos
```

### Función Fetch Genérica

```javascript
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

### Manipulación del DOM

#### 1. **Renderizado Dinámico**

```javascript
// Crear elementos HTML desde datos de API
container.innerHTML = recetas.map(meal => `
    <div class="receta-card">
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
    </div>
`).join('');
```

#### 2. **Event Listeners**

```javascript
// Búsqueda
searchBtn.addEventListener('click', buscarRecetas);

// Enter en input
searchInput.addEventListener('keypress', (e) => 
    e.key === 'Enter' && buscarRecetas()
);

// Modal
modal.addEventListener('click', (e) => 
    e.target === modal && cerrarModal()
);
```

#### 3. **LocalStorage**

```javascript
// Guardar favoritos
localStorage.setItem('favoritos', JSON.stringify(favoritos));

// Cargar favoritos
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
```

### Funcionalidades Clave

#### 1. **Sistema de Favoritos**

```javascript
function toggleFavorito(id, nombre, imagen) {
    const index = favoritos.findIndex(f => f.idMeal === id);
    
    if (index > -1) {
        favoritos.splice(index, 1); // Eliminar
    } else {
        favoritos.push({ idMeal: id, strMeal: nombre, strMealThumb: imagen }); // Agregar
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    renderizarFavoritos();
}
```

#### 2. **Modal Dinámico**

```javascript
async function verDetalle(id) {
    const data = await fetchAPI(`lookup.php?i=${id}`);
    const meal = data.meals[0];
    
    // Extraer ingredientes
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim()) ingredientes.push(ing);
    }
    
    // Renderizar modal
    modalBody.innerHTML = `...`;
    modal.classList.add('active');
}
```

#### 3. **Búsqueda**

```javascript
async function buscarRecetas() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    const data = await fetchAPI(`search.php?s=${query}`);
    
    if (data?.meals) {
        renderizarRecetas(data.meals, recetasGrid);
    } else {
        recetasGrid.innerHTML = '<p>No se encontraron recetas</p>';
    }
}
```

## 🚀 Cómo Usar

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador
3. **Explorar** recetas, buscar, agregar favoritos

### No requiere instalación ni servidor

## 📱 Responsive Design

### Desktop (> 768px)
- Grid de 3-4 columnas
- Navegación horizontal
- Modal amplio

### Tablet (481px - 768px)
- Grid de 2 columnas
- Navegación colapsable

### Mobile (< 480px)
- Grid de 1 columna
- Menú hamburguesa
- Búsqueda vertical

## 🎯 Funcionalidades Implementadas

### HTML Semántico
- ✅ Uso correcto de etiquetas semánticas
- ✅ Accesibilidad (aria-label)
- ✅ Estructura clara y organizada

### CSS Avanzado
- ✅ Flexbox para layouts flexibles
- ✅ Grid para layouts complejos
- ✅ Variables CSS para temas
- ✅ Media queries para responsive
- ✅ Transiciones y animaciones
- ✅ Pseudo-clases (:hover)

### JavaScript Moderno
- ✅ Async/Await para APIs
- ✅ Arrow functions
- ✅ Template literals
- ✅ Destructuring
- ✅ Array methods (map, filter, find)
- ✅ LocalStorage API
- ✅ Event delegation

## 🔧 Personalización

### Cambiar Colores

Editar variables en `style.css`:

```css
:root {
    --primary: #tu-color;
    --secondary: #tu-color;
}
```

### Agregar Más Recetas

Modificar en `script.js`:

```javascript
// Cambiar cantidad de recetas aleatorias
for (let i = 0; i < 12; i++) { // Cambiar 8 a 12
    const data = await fetchAPI('random.php');
}
```

## 📊 API - TheMealDB

### Límites
- Gratuita
- Sin autenticación requerida
- Sin límite de requests

### Datos Disponibles
- 300+ recetas
- 14 categorías
- 25 áreas geográficas
- Ingredientes y medidas
- Instrucciones
- Videos de YouTube

## 🐛 Solución de Problemas

### Las imágenes no cargan
- Verificar conexión a internet
- API puede estar temporalmente caída

### Favoritos no se guardan
- Verificar que el navegador permita LocalStorage
- Modo incógnito puede bloquear LocalStorage

### Modal no cierra
- Hacer clic fuera del modal
- Usar botón X en la esquina

## 📈 Mejoras Futuras

- [ ] Filtros por área geográfica
- [ ] Sistema de calificaciones
- [ ] Compartir en redes sociales
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Recetas offline

## 👨‍💻 Autor

Proyecto educativo - Cocina Gourmet 2024

## 📄 Licencia

Uso libre para aprendizaje. Datos de [TheMealDB](https://www.themealdb.com/)
