import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto text-slate-200">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
        <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Política de Privacidade e Proteção de Dados</h2>
          <p className="text-xs font-mono text-slate-400">Conformidade com a LGPD (Lei nº 13.709/2018) &bull; EnerControl</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-cyan-400 prose-headings:font-mono prose-p:text-slate-300 prose-li:text-slate-300 font-sans text-sm leading-relaxed space-y-4">
        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">1. INTRODUÇÃO</h3>
        <p>
          Esta Política de Privacidade descreve como o sistema <strong className="text-white">EnerControl</strong> coleta, utiliza, armazena e protege os dados pessoais e operacionais processados no ambiente corporativo da <strong className="text-white">Equatorial Energia</strong>.
        </p>
        <p>
          O EnerControl está comprometido com a segurança da informação e com a conformidade integral à <strong className="text-white">Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>. Esta política visa garantir transparência sobre o tratamento de dados realizado pelo sistema, assegurando que as atividades sejam conduzidas com ética, integridade e respeito aos direitos dos usuários.
        </p>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">2. DADOS COLETADOS</h3>
        <p>Para viabilizar as funcionalidades de gestão e monitoramento, o EnerControl coleta as seguintes categorias de dados:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Dados Pessoais:</strong> Nome completo, login de acesso, cargo, departamento e e-mail corporativo.</li>
          <li><strong className="text-white">Dados de Uso:</strong> Registros de acesso (logs), endereços IP, horários de início e fim de sessão, e interações realizadas dentro do sistema (funcionalidades acessadas).</li>
          <li><strong className="text-white">Dados Operacionais:</strong> Indicadores de desempenho, métricas de tempo de atendimento, tempo de espera, registros de SLA (15 e 30 minutos) e dados relacionados aos atendimentos geridos no sistema.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">3. FINALIDADE DO TRATAMENTO</h3>
        <p>Os dados coletados pelo EnerControl são tratados exclusivamente para as seguintes finalidades:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Gestão de Atendimentos:</strong> Organizar e processar as demandas operacionais.</li>
          <li><strong className="text-white">Monitoramento de Desempenho:</strong> Calcular indicadores de SLA e métricas de eficiência operacional.</li>
          <li><strong className="text-white">Segurança e Auditoria:</strong> Garantir a integridade do sistema, prevenir fraudes e auditar atividades realizadas pelos usuários.</li>
          <li><strong className="text-white">Melhoria do Sistema:</strong> Analisar padrões de uso para otimizar funcionalidades e a experiência do usuário.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">4. BASE LEGAL (LGPD)</h3>
        <p>O tratamento de dados realizado pelo EnerControl fundamenta-se nas seguintes bases legais previstas na LGPD:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Execução de Contrato:</strong> Necessário para a prestação dos serviços de gestão operacional aos colaboradores da Equatorial Energia.</li>
          <li><strong className="text-white">Legítimo Interesse:</strong> Para fins de segurança, auditoria de acesso e melhoria contínua da performance do sistema.</li>
          <li><strong className="text-white">Cumprimento de Obrigação Legal ou Regulatória:</strong> Quando o tratamento for necessário para atender a determinações legais aplicáveis às atividades da Empresa.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">5. COMPARTILHAMENTO DE DADOS</h3>
        <p>O EnerControl <strong className="text-white">não comercializa</strong> dados pessoais ou operacionais. O compartilhamento de dados poderá ocorrer apenas nas seguintes hipóteses:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Internamente:</strong> Com os departamentos da Equatorial Energia autorizados a acessar as informações para fins de gestão e auditoria.</li>
          <li><strong className="text-white">Prestadores de Serviços:</strong> Com fornecedores de tecnologia (ex: hospedagem em nuvem) que atuam como operadores de dados, sob estritas obrigações de confidencialidade e segurança.</li>
          <li><strong className="text-white">Obrigações Legais:</strong> Por determinação de autoridades competentes ou ordem judicial.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">6. ARMAZENAMENTO E SEGURANÇA</h3>
        <p>O EnerControl adota medidas técnicas e administrativas aptas a proteger os dados contra acessos não autorizados, destruição, perda, alteração ou qualquer forma de tratamento inadequado.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Controle de Acesso:</strong> O acesso ao sistema é restrito e autenticado, sendo concedido apenas aos usuários autorizados.</li>
          <li><strong className="text-white">Proteção:</strong> Utilizamos protocolos de segurança (criptografia em trânsito) para garantir a integridade das informações.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">7. DIREITOS DOS TITULARES</h3>
        <p>Conforme o art. 18 da LGPD, o usuário, na qualidade de titular dos dados, possui os seguintes direitos:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Acesso, correção de dados incompletos ou desatualizados, exclusão (quando aplicável), portabilidade e informação sobre o compartilhamento de dados.</li>
          <li><strong className="text-white">Como solicitar:</strong> As solicitações devem ser encaminhadas ao canal de privacidade da Equatorial Energia ou ao DPO (Encarregado de Dados) da Empresa.</li>
        </ul>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">8. RETENÇÃO DE DADOS</h3>
        <p>Os dados serão retidos pelo EnerControl apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, respeitando as necessidades operacionais da Equatorial Energia e eventuais prazos legais de guarda de documentos.</p>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">9. COOKIES E TECNOLOGIAS</h3>
        <p>O EnerControl utiliza cookies estritamente necessários para manter a sessão do usuário ativa e garantir a segurança do acesso. Não utilizamos tecnologias de rastreamento para fins de publicidade ou marketing.</p>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">10. ALTERAÇÕES NA POLÍTICA</h3>
        <p>Esta Política de Privacidade poderá ser atualizada periodicamente para refletir mudanças nas funcionalidades do EnerControl ou nas exigências legais. Recomendamos que os usuários revisem este documento regularmente.</p>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">11. CONTATO</h3>
        <p>Para dúvidas, solicitações ou reclamações relacionadas à privacidade e proteção de dados no EnerControl, entre em contato com o Encarregado de Dados (DPO) da Equatorial Energia através do canal oficial de privacidade da Empresa.</p>

        <h3 className="text-base font-bold text-cyan-400 mt-6 mb-2 uppercase tracking-wider">12. USO CORPORATIVO</h3>
        <p>O EnerControl é uma ferramenta de uso interno, voltada exclusivamente para as atividades operacionais da <strong className="text-white">Equatorial Energia</strong>. O acesso e a utilização do sistema estão vinculados ao exercício das funções profissionais do colaborador.</p>

        <hr className="my-8 border-slate-800" />

        <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider">CLÁUSULAS ADICIONAIS</h3>
        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mt-4">13. AUDITORIA E MONITORAMENTO DE ATIVIDADES</h4>
        <p>O EnerControl registra logs detalhados de todas as atividades realizadas pelos usuários. O Desenvolvedor e a Equatorial Energia reservam-se o direito de monitorar e auditar tais registros para garantir a segurança da informação, a conformidade com as normas internas e a integridade dos dados operacionais. O usuário declara estar ciente de que suas ações no sistema são passíveis de monitoramento.</p>

        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mt-4">14. RESPONSABILIDADE DO USUÁRIO</h4>
        <p>O usuário é integralmente responsável pelo uso adequado do EnerControl. É vedado o compartilhamento de credenciais de acesso. O usuário compromete-se a utilizar o sistema estritamente para os fins profissionais a que se destina, sendo responsável por qualquer uso indevido, violação de confidencialidade ou ação que comprometa a segurança dos dados ou a operação da Equatorial Energia.</p>

        <p className="text-xs font-mono text-slate-500 mt-8 pt-4 border-t border-slate-800">
          <em>Política de Privacidade atualizada em 01 de abril de 2026.</em>
        </p>
      </div>
    </div>
  );
}

