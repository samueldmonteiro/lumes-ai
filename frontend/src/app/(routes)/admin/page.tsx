'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  FileText,
  Braces,
  FileUp,
  Trash2,
  Eye,
  Upload,
  Search,
  FileJson,
  FileType,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminLayout } from '@/components/templates/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { adminClient } from '@/services/adminService';
import { useChatTheme } from '@/features/chat/hooks/useChatTheme';
import type { AdminDocument, IngestMode, AdminStats } from '@/types/admin';

type TabId = 'dashboard' | 'upload' | 'documents';

export default function AdminPage() {
  const { isDark } = useChatTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [ingestMode, setIngestMode] = useState<IngestMode>('text');
  const [textContent, setTextContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [source, setSource] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [jsonError, setJsonError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [dataKey, setDataKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [docs, st] = await Promise.all([
        adminClient.listDocuments(),
        adminClient.getStats(),
      ]);
      if (cancelled) return;
      setDocuments(docs);
      setStats(st);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [dataKey]);

  const filteredDocuments = useMemo(
    () => searchQuery
      ? documents.filter((d) => d.source.toLowerCase().includes(searchQuery.toLowerCase()))
      : documents,
    [documents, searchQuery],
  );

  const handleIngest = useCallback(async () => {
    if (!source.trim()) {
      toast.error('O campo Origem é obrigatório');
      return;
    }

    setIngesting(true);
    try {
      let result;
      if (ingestMode === 'text') {
        if (!textContent.trim() || textContent.trim().length < 10) {
          toast.error('O texto deve ter pelo menos 10 caracteres');
          setIngesting(false);
          return;
        }
        result = await adminClient.ingestText(textContent.trim(), source.trim());
      } else if (ingestMode === 'json') {
        let parsed: Record<string, unknown>;
        try { parsed = JSON.parse(jsonContent); } catch {
          toast.error('JSON inválido. Verifique a sintaxe.');
          setIngesting(false);
          return;
        }
        result = await adminClient.ingestJson(parsed, source.trim());
      } else {
        if (!pdfFile) {
          toast.error('Selecione um arquivo PDF');
          setIngesting(false);
          return;
        }
        result = await adminClient.ingestPdf(pdfFile, source.trim());
      }

      toast.success(`Documento ingerido com sucesso! ${result.chunksSaved} chunks salvos.`);
      setTextContent('');
      setJsonContent('');
      setPdfFile(null);
      setSource('');
      setDataKey((k) => k + 1);
    } catch {
      toast.error('Erro ao ingerir documento');
    } finally {
      setIngesting(false);
    }
  }, [source, ingestMode, textContent, jsonContent, pdfFile]);

  const handleDelete = useCallback(async (src: string) => {
    await adminClient.deleteDocument(src);
    toast.success('Documento excluído com sucesso!');
    setDeleteConfirm(null);
    setDataKey((k) => k + 1);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são aceitos');
        return;
      }
      setPdfFile(file);
      setSource(file.name.replace(/\.pdf$/i, ''));
    }
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleString('pt-BR');

  const typeConfig: Record<IngestMode, { icon: React.ReactNode; label: string; placeholder: string }> = {
    text: { icon: <FileText className="w-4 h-4" />, label: 'Texto', placeholder: 'Cole seu texto aqui...' },
    json: { icon: <Braces className="w-4 h-4" />, label: 'JSON', placeholder: '{"chave": "valor"}' },
    pdf: { icon: <FileUp className="w-4 h-4" />, label: 'PDF', placeholder: '' },
  };

  if (loading && !stats) {
    return (
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onSidebarOpen={() => setSidebarOpen(true)}
        onSidebarClose={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando painel...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="w-full max-w-5xl mx-auto">
        <TabsList variant="line" className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        {/* ═══════════════ DASHBOARD ═══════════════ */}
        <TabsContent value="dashboard" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card size="sm">
                <CardHeader>
                  <CardDescription>Total de Documentos</CardDescription>
                  <CardTitle className="text-2xl font-bold">{stats?.totalDocs ?? 0}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card size="sm">
                <CardHeader>
                  <CardDescription>Total de Chunks</CardDescription>
                  <CardTitle className="text-2xl font-bold">{stats?.totalChunks ?? 0}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card size="sm">
                <CardHeader>
                  <CardDescription>Fontes Únicas</CardDescription>
                  <CardTitle className="text-2xl font-bold">{stats?.uniqueSources ?? 0}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card size="sm">
                <CardHeader>
                  <CardDescription>Último Upload</CardDescription>
                  <CardTitle className="text-sm font-medium truncate">
                    {stats?.lastUpload ? formatDate(stats.lastUpload) : 'Nenhum'}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {(['text', 'json', 'pdf'] as const).map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {type === 'text' && <FileType className="w-4 h-4 text-blue-400" />}
                        {type === 'json' && <FileJson className="w-4 h-4 text-amber-400" />}
                        {type === 'pdf' && <FileUp className="w-4 h-4 text-red-400" />}
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="secondary">{stats?.documentsByType[type] ?? 0}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum documento ingerido ainda.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {documents.slice(0, 5).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between text-sm">
                        <span className="truncate max-w-[200px] font-medium">{doc.source}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={doc.type === 'pdf' ? 'destructive' : doc.type === 'json' ? 'outline' : 'secondary'}>
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(doc.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══════════════ UPLOAD ═══════════════ */}
        <TabsContent value="upload" className="mt-0">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Ingerir Documento</CardTitle>
              <CardDescription>
                Escolha o tipo de conteúdo, insira os dados e defina uma origem para o documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Abas de tipo de conteúdo */}
              <div className="flex flex-col gap-3">
                <Label>Tipo de Conteúdo</Label>
                <div className="flex gap-2">
                  {(Object.entries(typeConfig) as [IngestMode, typeof typeConfig[IngestMode]][]).map(([mode, cfg]) => (
                    <Button
                      key={mode}
                      type="button"
                      variant={ingestMode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => { setIngestMode(mode); setJsonError(''); }}
                      className="gap-1.5"
                    >
                      {cfg.icon}
                      {cfg.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Modo texto */}
              {ingestMode === 'text' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="text-content">Conteúdo em Texto</Label>
                  <Textarea
                    id="text-content"
                    placeholder="Cole o texto que deseja indexar..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              )}

              {/* Modo JSON */}
              {ingestMode === 'json' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="json-content">Conteúdo JSON</Label>
                  <Textarea
                    id="json-content"
                    placeholder='{"chave": "valor", "numero": 42}'
                    value={jsonContent}
                    onChange={(e) => {
                      setJsonContent(e.target.value);
                      try { JSON.parse(e.target.value); setJsonError(''); } catch { setJsonError('JSON inválido'); }
                    }}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
                </div>
              )}

              {/* Modo PDF */}
              {ingestMode === 'pdf' && (
                <div className="flex flex-col gap-2">
                  <Label>Arquivo PDF</Label>
                  <label
                    className={cn(
                      'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors',
                      isDark 
                        ? 'border-input hover:border-violet-500/50 bg-muted' 
                        : 'border-input hover:border-violet-400 bg-background',
                    )}
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {pdfFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileUp className="w-8 h-8 text-violet-400" />
                        <p className="text-sm font-medium">{pdfFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                        <Button type="button" variant="ghost" size="xs" onClick={(e) => { e.preventDefault(); setPdfFile(null); setSource(''); }}>
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileUp className="w-10 h-10 text-muted-foreground" />
                        <p className="text-sm font-medium">Clique para selecionar ou arraste um PDF</p>
                        <p className="text-xs text-muted-foreground">Apenas arquivos .pdf</p>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* Campo de origem */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="source">
                  Origem (Source)
                  {ingestMode === 'pdf' && (
                    <span className="text-xs text-muted-foreground ml-2">(preenchido automaticamente)</span>
                  )}
                </Label>
                <Input
                  id="source"
                  placeholder="Ex: manual-ajuda, edital-2026"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {ingestMode === 'pdf'
                    ? 'O nome do arquivo foi usado como origem. Você pode alterar se necessário.'
                    : 'Identificador único do documento. Se já existir, o documento será sobrescrito.'}
                </p>
              </div>

              <Button
                type="button"
                onClick={handleIngest}
                disabled={ingesting}
                className="w-full gap-2"
              >
                {ingesting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Ingerindo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Ingerir Documento
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════ DOCUMENTOS ═══════════════ */}
        <TabsContent value="documents" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>{documents.length} documento(s) no total</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por origem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Chunks</TableHead>
                    <TableHead className="hidden sm:table-cell">Criado em</TableHead>
                    <TableHead className="hidden sm:table-cell">Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        {searchQuery ? 'Nenhum documento encontrado para esta busca.' : 'Nenhum documento ingerido ainda.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{doc.source}</TableCell>
                        <TableCell>
                          <Badge variant={doc.type === 'pdf' ? 'destructive' : doc.type === 'json' ? 'outline' : 'secondary'}>
                            {doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.chunks}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(doc.createdAt)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(doc.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog>
                              <DialogTrigger>
                                <Button variant="ghost" size="icon-sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>{doc.source}</DialogTitle>
                                  <DialogDescription>
                                    Tipo: {doc.type} &middot; {doc.chunks} chunks
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[300px] overflow-y-auto rounded-lg bg-muted/50 p-4">
                                  <pre className="text-sm whitespace-pre-wrap font-sans">{doc.content}</pre>
                                </div>
                                <DialogFooter showCloseButton />
                              </DialogContent>
                            </Dialog>

                            <Dialog open={deleteConfirm === doc.source} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
                              <DialogTrigger>
                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteConfirm(doc.source)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Documento</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir o documento &ldquo;{doc.source}&rdquo;?
                                    Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    Cancelar
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleDelete(doc.source)}>
                                    Excluir
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

