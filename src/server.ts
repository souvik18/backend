import app from './app.ts';

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`server running http://localhost:${PORT}`);
});
