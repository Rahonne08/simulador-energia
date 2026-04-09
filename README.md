# ⚡ EnerControl - Simulador Inteligente de Conta de Energia

## 📊 Visão Geral

O **EnerControl** é uma aplicação web desenvolvida para simular o consumo e o valor da conta de energia elétrica de forma simples, rápida e educativa.

O sistema foi pensado para ser utilizado tanto por **clientes** quanto por **colaboradores**, auxiliando na tomada de decisão, transparência no atendimento e educação energética.

---

## 🎯 Objetivo do Projeto

* Melhorar a experiência do cliente no entendimento da conta de energia
* Apoiar atendentes durante o atendimento
* Reduzir dúvidas recorrentes sobre consumo e valores
* Fortalecer a imagem de inovação da empresa

---

## 💼 Aplicação no Negócio

O EnerControl pode ser utilizado em diversos cenários:

* Atendimento presencial e digital
* Apoio em negociações com clientes
* Demonstração de consumo em tempo real
* Educação energética para redução de consumo

---

## 🚀 Funcionalidades

* Simulação de consumo mensal (kWh)
* Cálculo estimado do valor da fatura
* Interface simples e intuitiva
* Execução rápida sem necessidade de instalação
* Compatível com desktop e dispositivos móveis

---

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## 📁 Estrutura do Projeto

```
enercontrol/
│
├── index.html
├── style.css
└── script.js
```

---

## 📄 Código do Projeto

### 🔹 index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EnerControl</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <h1>⚡ EnerControl</h1>
        <p>Simule sua conta de energia</p>

        <label>Potência do aparelho (W):</label>
        <input type="number" id="potencia">

        <label>Horas de uso por dia:</label>
        <input type="number" id="horas">

        <label>Dias de uso no mês:</label>
        <input type="number" id="dias">

        <label>Tarifa (R$/kWh):</label>
        <input type="number" id="tarifa" step="0.01">

        <button onclick="calcular()">Calcular</button>

        <h2 id="resultado"></h2>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

### 🎨 style.css

```css
body {
    font-family: Arial, sans-serif;
    background: #0f172a;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    background: #1e293b;
    padding: 30px;
    border-radius: 10px;
    width: 320px;
    box-shadow: 0 0 15px rgba(0,0,0,0.6);
}

h1 {
    text-align: center;
}

label {
    display: block;
    margin-top: 10px;
}

input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 5px;
    border: none;
}

button {
    width: 100%;
    margin-top: 15px;
    padding: 10px;
    background: #22c55e;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background: #16a34a;
}

#resultado {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
}
```

---

### ⚙️ script.js

```javascript
function calcular() {
    const potencia = document.getElementById('potencia').value;
    const horas = document.getElementById('horas').value;
    const dias = document.getElementById('dias').value;
    const tarifa = document.getElementById('tarifa').value;

    const consumo = (potencia * horas * dias) / 1000;
    const valor = consumo * tarifa;

    document.getElementById('resultado').innerText = 
        `Consumo: ${consumo.toFixed(2)} kWh | Valor: R$ ${valor.toFixed(2)}`;
}
```

---

## 🧮 Metodologia de Cálculo

**Consumo (kWh):**

```
(potência × horas × dias) ÷ 1000
```

**Valor estimado:**

```
consumo × tarifa
```

---

## 📈 Benefícios Estratégicos

* Redução de tempo de atendimento
* Aumento da satisfação do cliente
* Ferramenta de apoio comercial
* Posicionamento da empresa como inovadora

---

## 🔮 Evoluções Futuras

* Inclusão de múltiplos aparelhos
* Integração com tarifas reais da concessionária
* Simulação com bandeiras tarifárias
* Dashboard com gráficos de consumo
* Versão mobile (App)

---

## ▶️ Como Executar

1. Abrir o projeto no VS Code
2. Executar o arquivo `index.html`

---

## 👨‍💻 Autor

Desenvolvido por **Pablo Rahonne**

---

## 📌 Considerações Finais

O EnerControl é uma solução simples, porém de alto impacto, com potencial para melhorar significativamente a experiência do cliente e otimizar processos internos.

Sua implementação pode ser feita de forma rápida, com baixo custo e alta escalabilidade.

