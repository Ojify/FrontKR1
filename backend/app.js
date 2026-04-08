const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

let products = [
  { id: nanoid(6), name: 'Браслет', category: 'Браслеты', description: 'Браслет из серебра', price: 1200, stock: 5, rating: 4.5, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Алмаз', category: 'Камни', description: 'Драгоценный камень', price: 25, stock: 20, rating: 4.2, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Серьги', category: 'Серьги', description: 'Серебряные серьги с лунным камнем', price: 80, stock: 15, rating: 4.7, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Браслет', category: 'Браслеты', description: 'Золотой браслет', price: 35, stock: 8, rating: 4.9, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Рубин', category: 'Камни', description: 'Драгоценный камень', price: 90, stock: 12, rating: 4.3, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Корона с алмазами', category: 'Короны', description: 'Корона с алмазами из золота', price: 800, stock: 7, rating: 4.6, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Колье', category: 'Украшения на шею', description: 'Колье с изумрудом из золота', price: 50, stock: 25, rating: 4.1, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Опал', category: 'Камни', description: 'Драгоценный камень', price: 300, stock: 10, rating: 4.4, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Цепочка', category: 'Украшения на шею', description: 'Цепочка из золота', price: 150, stock: 6, rating: 4.8, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Кольцо', category: 'Кольца', description: 'Кольцо с самоцветом', price: 200, stock: 4, rating: 4.0, image: 'https://via.placeholder.com/150' }
];

// CORS – разрешаем запросы с фронтенда (порт 3001)
app.use(cors({ origin: 'http://localhost:3001', methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', req.body);
    }
  });
  next();
});

// Вспомогательная функция для поиска товара по id
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

// ----- Конфигурация Swagger -----
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API управления товарами',
    version: '1.0.0',
    description: 'Документация API для интернет-магазина',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Сервер разработки',
    },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Уникальный идентификатор' },
          name: { type: 'string', description: 'Название товара' },
          category: { type: 'string', description: 'Категория' },
          description: { type: 'string', description: 'Описание' },
          price: { type: 'number', description: 'Цена' },
          stock: { type: 'integer', description: 'Количество на складе' },
          rating: { type: 'number', description: 'Рейтинг' },
          image: { type: 'string', description: 'URL изображения' },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./app.js'], // путь к файлам с аннотациями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----- Маршруты для товаров с документацией -----

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Успешный ответ со списком товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о товаре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Не хватает обязательных полей
 */
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
    image: image || 'https://via.placeholder.com/150'
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               rating: { type: number }
 *               image: { type: string }
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  const { name, category, description, price, stock, rating, image } = req.body;
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = image;

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удалён (нет содержимого)
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: 'Product not found' });
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// 404 для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI доступен на http://localhost:${port}/api-docs`);
});