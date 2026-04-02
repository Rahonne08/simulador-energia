import React from 'react';
import { FileText } from 'lucide-react';

export default function License() {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Contrato de Licença de Uso de Software (EULA)</h2>
      </div>

      <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-indigo-600">
        <p>
          Este Contrato de Licença de Uso de Software ("Contrato") é um acordo legal entre você (o "Usuário" ou "Licenciado") e o Desenvolvedor do software, estabelecendo os termos e condições para o uso do sistema <strong>EnerControl</strong>, desenvolvido para uso corporativo exclusivo no ambiente da <strong>Equatorial Energia</strong>.
        </p>
        <p>
          Ao acessar ou utilizar o EnerControl, você declara ter lido, compreendido e concordado com todos os termos aqui dispostos.
        </p>

        <h3>1. DEFINIÇÕES</h3>
        <p>Para fins deste Contrato, entende-se por:</p>
        <ul>
          <li><strong>Software/EnerControl:</strong> O aplicativo web de gestão de atendimentos, monitoramento de indicadores e suporte à tomada de decisão operacional.</li>
          <li><strong>Sistema:</strong> A infraestrutura tecnológica, incluindo o Software, interfaces, bancos de dados e funcionalidades associadas.</li>
          <li><strong>Usuário:</strong> Colaborador, prestador de serviço ou preposto da Equatorial Energia autorizado a acessar o Sistema.</li>
          <li><strong>Licença:</strong> A autorização concedida para o uso do Software, nos termos deste Contrato.</li>
          <li><strong>Empresa:</strong> Equatorial Energia, ambiente corporativo onde o Software é licenciado para operação.</li>
          <li><strong>Dados:</strong> Informações operacionais, indicadores de desempenho (tempo médio, espera, SLA) e dados de uso coletados pelo Sistema.</li>
          <li><strong>Plataforma:</strong> O ambiente web onde o EnerControl é hospedado e disponibilizado.</li>
        </ul>

        <h3>2. OBJETO</h3>
        <p>O objeto deste Contrato é a concessão de licença de uso do EnerControl, visando a gestão de atendimentos, monitoramento de indicadores (SLA de 15 e 30 minutos) e apoio à tomada de decisão operacional no âmbito da Equatorial Energia.</p>

        <h3>3. CONCESSÃO DE LICENÇA</h3>
        <p>O Desenvolvedor concede ao Usuário uma licença limitada, não exclusiva, intransferível e revogável para utilizar o EnerControl, estritamente para fins profissionais e dentro do ambiente corporativo autorizado da Equatorial Energia. Esta licença não implica a transferência de propriedade do Software.</p>

        <h3>4. RESTRIÇÕES DE USO</h3>
        <p>É estritamente proibido ao Usuário:</p>
        <ul>
          <li>Copiar, modificar, adaptar, traduzir ou criar obras derivadas do Software;</li>
          <li>Realizar engenharia reversa, descompilação ou desmontagem do código-fonte;</li>
          <li>Utilizar o Software para fins diversos da finalidade empresarial definida;</li>
          <li>Compartilhar credenciais de acesso ou permitir o uso do Sistema por terceiros não autorizados.</li>
        </ul>

        <h3>5. PROPRIEDADE INTELECTUAL</h3>
        <p>Todos os direitos de propriedade intelectual sobre o EnerControl, incluindo, mas não se limitando a, código-fonte, algoritmos, interface gráfica (UI), design, funcionalidades, marcas e documentação, pertencem exclusivamente ao Desenvolvedor. O uso do Software não confere ao Usuário ou à Empresa qualquer direito de propriedade sobre tais ativos.</p>

        <h3>6. PRIVACIDADE E PROTEÇÃO DE DADOS</h3>
        <p>O EnerControl coleta dados operacionais e de uso para o aprimoramento do Sistema e suporte à decisão. O tratamento de dados será realizado em estrita conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong>. O Usuário e a Empresa comprometem-se a garantir que a inserção de dados no Sistema respeite as normas de privacidade aplicáveis.</p>

        <h3>7. RESPONSABILIDADES DO USUÁRIO</h3>
        <p>O Usuário é responsável por:</p>
        <ul>
          <li>Utilizar o Sistema de forma ética e adequada;</li>
          <li>Manter a confidencialidade e segurança de seu login e senha, sendo o único responsável por todas as ações realizadas sob sua conta;</li>
          <li>Comunicar imediatamente ao Desenvolvedor ou à Empresa qualquer suspeita de acesso não autorizado.</li>
        </ul>

        <h3>8. LIMITAÇÃO DE RESPONSABILIDADE</h3>
        <p>O EnerControl é fornecido "no estado em que se encontra". O Desenvolvedor não se responsabiliza por danos indiretos, lucros cessantes, perda de dados ou interrupções operacionais decorrentes do uso ou da impossibilidade de uso do Sistema, salvo em casos de dolo ou culpa grave comprovada.</p>

        <h3>9. SUPORTE, MANUTENÇÃO E ATUALIZAÇÕES</h3>
        <p>O Desenvolvedor poderá disponibilizar atualizações e melhorias contínuas no EnerControl. O suporte técnico será prestado conforme as políticas internas da Empresa ou contrato de nível de serviço (SLA) específico firmado entre o Desenvolvedor e a Equatorial Energia.</p>

        <h3>10. RESCISÃO</h3>
        <p>Este Contrato poderá ser rescindido automaticamente, sem necessidade de aviso prévio, em caso de violação de qualquer das cláusulas aqui estabelecidas. A rescisão implica a cessação imediata do direito de acesso e uso do EnerControl.</p>

        <h3>11. CONFIDENCIALIDADE</h3>
        <p>O Usuário obriga-se a manter o mais absoluto sigilo sobre todas as informações internas da Empresa e dados operacionais acessados via EnerControl, não podendo divulgá-los a terceiros sem autorização expressa.</p>

        <h3>12. DISPOSIÇÕES GERAIS</h3>
        <ul>
          <li>Este Contrato é regido pelas leis da República Federativa do Brasil.</li>
          <li>Fica eleito o foro da comarca da sede da Empresa para dirimir quaisquer controvérsias decorrentes deste instrumento.</li>
        </ul>

        <h3>13. ACEITE DOS TERMOS</h3>
        <p>O acesso e a utilização do EnerControl constituem aceitação integral e irrevogável de todos os termos e condições deste Contrato.</p>

        <hr className="my-8" />

        <h3>CLÁUSULAS EXTRAS</h3>
        <h4>14. DO USO INTERNO CORPORATIVO</h4>
        <p>O EnerControl destina-se exclusivamente ao uso interno e operacional da Equatorial Energia. É vedada a utilização do Software para fins comerciais externos, prestação de serviços a terceiros ou qualquer finalidade que não esteja vinculada às atividades operacionais da Empresa.</p>

        <h4>15. DA AUDITORIA E MONITORAMENTO</h4>
        <p>O Desenvolvedor e a Empresa reservam-se o direito de monitorar e auditar o uso do EnerControl, incluindo o acesso aos logs de atividades, para fins de segurança, verificação de conformidade com este Contrato e otimização do desempenho do Sistema. O Usuário declara estar ciente e de acordo com tal monitoramento.</p>

        <p className="text-sm text-slate-500 mt-8">
          <em>Documento gerado em 01 de abril de 2026.</em>
        </p>
      </div>
    </div>
  );
}
