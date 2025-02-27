// store/index.ts
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

// Criando o Pinia e aplicando o plugin de persistência
const pinia = createPinia();
pinia.use(piniaPersist); // Usando o plugin de persistência

export default pinia;