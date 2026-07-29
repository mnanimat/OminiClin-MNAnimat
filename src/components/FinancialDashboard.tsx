import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Plus,
  Trash2,
  Filter,
  Download,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Search,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { FinancialTransaction, FinancialCategory, PaymentMethod, ProfessionalProfile, Patient } from '../types';
import { StorageService } from '../services/storage';

interface FinancialDashboardProps {
  patients: Patient[];
}

const CATEGORY_LABELS: Record<FinancialCategory, string> = {
  consulta_medica: 'Consulta Médica',
  procedimento_odonto: 'Procedimento Odontológico',
  avaliacao_nutri: 'Avaliação Nutricional',
  retorno: 'Consulta de Retorno',
  aluguel_local: 'Aluguel do Consultório',
  equipamentos: 'Manutenção / Equipamentos',
  suprimentos: 'Insumos e Materiais Clínicos',
  sistemas_software: 'Licenças e Software Médico',
  impostos_taxas: 'Impostos e Taxas Bancárias',
  outros: 'Outros Custos',
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX Instantâneo',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  dinheiro: 'Espécie / Dinheiro',
  convenio: 'Faturamento Convênio',
  transferencia: 'Transferência / TED',
};

const SPECIALTY_COLORS: Record<string, string> = {
  medico: '#2563eb', // Blue
  dentista: '#0d9488', // Teal
  nutricionista: '#10b981', // Emerald
  clinica_geral: '#64748b', // Slate
};

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ patients }) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() =>
    StorageService.getFinancialTransactions()
  );
  const [filterType, setFilterType] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Transaction Form State
  const [newTx, setNewTx] = useState<{
    type: 'receita' | 'despesa';
    patientId: string;
    description: string;
    amount: string;
    category: FinancialCategory;
    specialty: ProfessionalProfile | 'clinica_geral';
    paymentMethod: PaymentMethod;
    date: string;
  }>({
    type: 'receita',
    patientId: '',
    description: '',
    amount: '',
    category: 'consulta_medica',
    specialty: 'medico',
    paymentMethod: 'pix',
    date: new Date().toISOString().substring(0, 10),
  });

  const refreshTransactions = () => {
    setTransactions(StorageService.getFinancialTransactions());
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(newTx.amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Informe um valor numérico válido maior que zero.');
      return;
    }

    const selectedPatient = patients.find((p) => p.id === newTx.patientId);

    const transactionToSave: FinancialTransaction = {
      id: `fin-${Date.now()}`,
      type: newTx.type,
      amount: numericAmount,
      patientId: newTx.patientId || undefined,
      patientName: selectedPatient ? selectedPatient.name : undefined,
      category: newTx.category,
      categoryLabel: CATEGORY_LABELS[newTx.category] || newTx.category,
      specialty: newTx.specialty,
      description: newTx.description.trim() || CATEGORY_LABELS[newTx.category],
      date: newTx.date || new Date().toISOString().substring(0, 10),
      paymentMethod: newTx.paymentMethod,
      status: 'concluido',
      createdAt: new Date().toISOString(),
    };

    StorageService.saveFinancialTransaction(transactionToSave);
    refreshTransactions();
    setIsModalOpen(false);

    // Reset Form
    setNewTx({
      type: 'receita',
      patientId: '',
      description: '',
      amount: '',
      category: 'consulta_medica',
      specialty: 'medico',
      paymentMethod: 'pix',
      date: new Date().toISOString().substring(0, 10),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este registro financeiro?')) {
      StorageService.deleteFinancialTransaction(id);
      refreshTransactions();
    }
  };

  // KPI Metrics calculation
  const totalReceitas = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'receita' && t.status === 'concluido')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalDespesas = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'despesa' && t.status === 'concluido')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const lucroLíquido = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? ((lucroLíquido / totalReceitas) * 100).toFixed(1) : '0';

  const totalAtendimentos = useMemo(() => {
    return transactions.filter((t) => t.type === 'receita').length;
  }, [transactions]);

  const ticketMedio = totalAtendimentos > 0 ? (totalReceitas / totalAtendimentos).toFixed(2) : '0';

  // Monthly aggregated data for Area / Bar Chart
  const monthlyChartData = useMemo(() => {
    const monthsMap: Record<string, { month: string; receitas: number; despesas: number; lucro: number }> = {};

    transactions.forEach((t) => {
      if (!t.date) return;
      const [year, month] = t.date.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthLabel = `${monthNames[parseInt(month, 10) - 1]}/${year.substring(2)}`;

      if (!monthsMap[monthLabel]) {
        monthsMap[monthLabel] = { month: monthLabel, receitas: 0, despesas: 0, lucro: 0 };
      }

      if (t.type === 'receita' && t.status === 'concluido') {
        monthsMap[monthLabel].receitas += t.amount;
      } else if (t.type === 'despesa' && t.status === 'concluido') {
        monthsMap[monthLabel].despesas += t.amount;
      }
      monthsMap[monthLabel].lucro = monthsMap[monthLabel].receitas - monthsMap[monthLabel].despesas;
    });

    return Object.values(monthsMap).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  // Revenue Distribution by Specialty Pie Chart
  const specialtyPieData = useMemo(() => {
    const map: Record<string, number> = {
      medico: 0,
      dentista: 0,
      nutricionista: 0,
    };

    transactions.forEach((t) => {
      if (t.type === 'receita' && t.status === 'concluido') {
        if (t.specialty in map) {
          map[t.specialty] += t.amount;
        }
      }
    });

    return [
      { name: 'Medicina', value: map.medico, color: SPECIALTY_COLORS.medico },
      { name: 'Odontologia', value: map.dentista, color: SPECIALTY_COLORS.dentista },
      { name: 'Nutrição', value: map.nutricionista, color: SPECIALTY_COLORS.nutricionista },
    ].filter((item) => item.value > 0);
  }, [transactions]);

  // Payment method breakdown data
  const paymentMethodData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === 'receita') {
        const label = PAYMENT_METHOD_LABELS[t.paymentMethod] || t.paymentMethod;
        map[label] = (map[label] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filterType === 'todos' || t.type === filterType;
      const matchSpec = filterSpecialty === 'todos' || t.specialty === filterSpecialty;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        t.description.toLowerCase().includes(q) ||
        (t.patientName && t.patientName.toLowerCase().includes(q)) ||
        t.categoryLabel.toLowerCase().includes(q);

      return matchType && matchSpec && matchSearch;
    });
  }, [transactions, filterType, filterSpecialty, searchTerm]);

  // Format Currency BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Data,Tipo,Especialidade,Categoria,Paciente,Descricao,MetodoPagamento,Valor,Status'];
    const rows = filteredTransactions.map((t) =>
      [
        t.id,
        t.date,
        t.type,
        t.specialty,
        `"${t.categoryLabel}"`,
        `"${t.patientName || 'N/A'}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.paymentMethod,
        t.amount.toFixed(2),
        t.status,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omniclin_relatorio_financeiro_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Gestão Financeira & Análise Gráfica
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fluxo de caixa local, conciliação por especialidade e indicadores de rentabilidade.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Lançamento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Bruta */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Receitas Totais</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatBRL(totalReceitas)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Entradas confirmadas de consultas
          </p>
        </div>

        {/* Despesas Totais */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Despesas Totais</span>
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatBRL(totalDespesas)}
          </p>
          <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
            Custos operacionais e insumos
          </p>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Lucro Líquido</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-extrabold ${lucroLíquido >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatBRL(lucroLíquido)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Margem de Lucro: <strong className="text-slate-900 dark:text-white">{margemLucro}%</strong>
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Ticket Médio / Procedimento</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatBRL(parseFloat(ticketMedio))}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Calculado em {totalAtendimentos} lançamentos
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Cash Flow Bar/Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Evolução Mensal: Receitas x Despesas
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Visão Histórica</span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val}`}
                />
                <Tooltip
                  formatter={(value: number) => [formatBRL(value)]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="receitas" name="Receitas (R$)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas (R$)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Distribution by Specialty Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Faturamento por Especialidade
            </h3>
          </div>

          {specialtyPieData.length > 0 ? (
            <div className="h-[220px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialtyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {specialtyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatBRL(value)]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-slate-400">
              Nenhuma receita registrada
            </div>
          )}

          {/* Specialty Legend Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {specialtyPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{formatBRL(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Payment Methods & Financial Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Meios de Pagamento
            </h3>
          </div>

          <div className="space-y-3">
            {paymentMethodData.map((pm) => {
              const percent = totalReceitas > 0 ? Math.round((pm.value / totalReceitas) * 100) : 0;
              return (
                <div key={pm.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{pm.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatBRL(pm.value)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Log List (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Extrato e Registros Financeiros ({filteredTransactions.length})
            </h3>

            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar lançamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white w-36 sm:w-44 focus:outline-hidden"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="todos">Todos Tipos</option>
                <option value="receita">Apenas Receitas</option>
                <option value="despesa">Apenas Despesas</option>
              </select>

              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="todos">Todas Especialidades</option>
                <option value="medico">Medicina</option>
                <option value="dentista">Odontologia</option>
                <option value="nutricionista">Nutrição</option>
                <option value="clinica_geral">Geral / Administrativo</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Tipo & Categoria</th>
                  <th className="py-2.5 px-3">Descrição / Paciente</th>
                  <th className="py-2.5 px-3">Pagamento</th>
                  <th className="py-2.5 px-3 text-right">Valor</th>
                  <th className="py-2.5 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredTransactions.map((t) => {
                  const isReceita = t.type === 'receita';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {t.date.split('-').reverse().join('/')}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isReceita ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {t.categoryLabel}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        <p className="font-medium line-clamp-1">{t.description}</p>
                        {t.patientName && (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                            {t.patientName}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {PAYMENT_METHOD_LABELS[t.paymentMethod] || t.paymentMethod}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-extrabold whitespace-nowrap ${
                          isReceita ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isReceita ? '+' : '-'} {formatBRL(t.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Excluir Lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      Nenhum registro financeiro encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: New Financial Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Registrar Novo Lançamento Financeiro
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              {/* Type Toggle: Receita vs Despesa */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewTx({ ...newTx, type: 'receita', category: 'consulta_medica' })}
                  className={`py-2 font-bold rounded-lg transition-all ${
                    newTx.type === 'receita'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  + Entrada / Receita
                </button>
                <button
                  type="button"
                  onClick={() => setNewTx({ ...newTx, type: 'despesa', category: 'aluguel_local' })}
                  className={`py-2 font-bold rounded-lg transition-all ${
                    newTx.type === 'despesa'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  - Saída / Despesa
                </button>
              </div>

              {/* Patient Selection (Optional) */}
              {newTx.type === 'receita' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vincular Paciente (Opcional)
                  </label>
                  <select
                    value={newTx.patientId}
                    onChange={(e) => setNewTx({ ...newTx, patientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Nenhum paciente selecionado (Avulso)</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category & Specialty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {newTx.type === 'receita' ? (
                      <>
                        <option value="consulta_medica">Consulta Médica</option>
                        <option value="procedimento_odonto">Procedimento Odontológico</option>
                        <option value="avaliacao_nutri">Avaliação Nutricional</option>
                        <option value="retorno">Consulta de Retorno</option>
                        <option value="outros">Outra Receita</option>
                      </>
                    ) : (
                      <>
                        <option value="aluguel_local">Aluguel do Consultório</option>
                        <option value="equipamentos">Equipamentos / Manutenção</option>
                        <option value="suprimentos">Suprimentos e Materiais</option>
                        <option value="sistemas_software">Sistemas e Software</option>
                        <option value="impostos_taxas">Impostos e Taxas</option>
                        <option value="outros">Outras Despesas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Especialidade / Setor *
                  </label>
                  <select
                    value={newTx.specialty}
                    onChange={(e) => setNewTx({ ...newTx, specialty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="medico">Medicina</option>
                    <option value="dentista">Odontologia</option>
                    <option value="nutricionista">Nutrição</option>
                    <option value="clinica_geral">Geral / Administrativo</option>
                  </select>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 350,00"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={newTx.paymentMethod}
                  onChange={(e) => setNewTx({ ...newTx, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="pix">PIX Instantâneo</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="dinheiro">Dinheiro em Espécie</option>
                  <option value="convenio">Faturamento Convênio</option>
                  <option value="transferencia">Transferência Bancária (TED)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição do Lançamento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Consulta de acompanhamento de rotina"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
