import { Component } from "react";

// Impede que um erro em qualquer componente derrube a página inteira (tela branca).
// Em vez disso, mostra uma mensagem e um botão para recarregar.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error("Erro capturado:", erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="center-state">
          <div className="error-box">
            <strong>Algo deu errado na interface.</strong>
            <p>{String(this.state.erro?.message || this.state.erro)}</p>
            <button className="back-btn" onClick={() => this.setState({ erro: null })}>
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
