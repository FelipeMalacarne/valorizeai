import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, CheckCircle, CreditCard, PieChart, Shield, Target, TrendingUp, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bem Vindo">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="bg-background min-h-screen">
                {/* Header */}
                <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                    <AppLogoIcon className="text-primary-foreground h-5 w-5" />
                                </div>
                                <span className="text-foreground text-xl font-bold">ValorizeAI</span>
                            </div>
                            <nav className="hidden items-center space-x-8 md:flex">
                                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Recursos
                                </a>
                                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Como Funciona
                                </a>
                                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Preços
                                </a>
                            </nav>
                            <div className="flex items-center space-x-4">
                                <ThemeToggle />
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={route('dashboard')}>Dashboard</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant={'ghost'} asChild>
                                            <Link href={route('login')}>Entrar</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('register')}>Começar Grátis</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 lg:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <Badge variant="secondary" className="mb-6">
                                <Zap className="mr-1 h-3 w-3" />
                                Powered by AI
                            </Badge>
                            <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                                Tenha <span className="text-primary">clareza total</span> das suas finanças
                            </h1>
                            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
                                Pare de usar múltiplas planilhas e apps. O ValorizeAI unifica tudo em uma plataforma inteligente que te dá controle e
                                tranquilidade financeira.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button size="lg" className="px-8 py-6 text-lg">
                                    <Link href={route('register')}>Começar Gratuitamente</Link>
                                </Button>
                                <Button variant="outline" size="lg" className="bg-transparent px-8 py-6 text-lg">
                                    Ver Demonstração
                                </Button>
                            </div>
                            <p className="text-muted-foreground mt-4 text-sm">
                                ✓ Grátis por 30 dias • ✓ Sem cartão de crédito • ✓ Configuração em 5 minutos
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-muted/30 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Quatro pilares para sua tranquilidade financeira</h2>
                            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                                Cada funcionalidade foi pensada para eliminar a complexidade e te dar clareza total
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="border-border transition-shadow hover:shadow-lg">
                                <CardHeader className="pb-4 text-center">
                                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <BarChart3 className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">Conciliação Bancária Inteligente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Importe extratos OFX/CSV e deixe a IA categorizar automaticamente suas transações
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-border transition-shadow hover:shadow-lg">
                                <CardHeader className="pb-4 text-center">
                                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <Target className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">Orçamento por Envelopes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Método de "envelopes" para dar um propósito a cada real antes de gastá-lo
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-border transition-shadow hover:shadow-lg">
                                <CardHeader className="pb-4 text-center">
                                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <CreditCard className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">Gestão de Cartões</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Controle de faturas e pagamentos integrado ao seu orçamento mensal
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-border transition-shadow hover:shadow-lg">
                                <CardHeader className="pb-4 text-center">
                                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                        <PieChart className="text-primary h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg">Acompanhamento de Investimentos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Visão consolidada da sua carteira com análise de performance
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Simples como deveria ser</h2>
                            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                                Em poucos minutos você terá uma visão completa das suas finanças
                            </p>
                        </div>

                        <div className="mx-auto max-w-4xl">
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                                        1
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold">Conecte suas contas</h3>
                                    <p className="text-muted-foreground">Importe seus extratos bancários ou conecte suas contas de forma segura</p>
                                </div>

                                <div className="text-center">
                                    <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                                        2
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold">Configure seu orçamento</h3>
                                    <p className="text-muted-foreground">Defina suas categorias e metas usando o método de envelopes</p>
                                </div>

                                <div className="text-center">
                                    <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                                        3
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold">Tenha controle total</h3>
                                    <p className="text-muted-foreground">Acompanhe gastos, investimentos e metas em tempo real</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-muted/30 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-16 text-center">
                                <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Por que escolher o ValorizeAI?</h2>
                            </div>

                            <div className="grid items-center gap-12 md:grid-cols-2">
                                <div>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                                            <div>
                                                <h3 className="mb-2 font-semibold">Segurança bancária</h3>
                                                <p className="text-muted-foreground">Criptografia de nível bancário e conformidade com LGPD</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                                            <div>
                                                <h3 className="mb-2 font-semibold">Inteligência artificial</h3>
                                                <p className="text-muted-foreground">Categorização automática e insights personalizados</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                                            <div>
                                                <h3 className="mb-2 font-semibold">Tudo em um lugar</h3>
                                                <p className="text-muted-foreground">Substitua múltiplas planilhas e apps por uma solução única</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <CheckCircle className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                                            <div>
                                                <h3 className="mb-2 font-semibold">Suporte especializado</h3>
                                                <p className="text-muted-foreground">Time de especialistas em finanças pessoais para te ajudar</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border-border rounded-lg border p-8">
                                    <div className="text-center">
                                        <Shield className="text-primary mx-auto mb-6 h-16 w-16" />
                                        <h3 className="mb-4 text-2xl font-bold">Seus dados estão seguros</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Utilizamos os mesmos padrões de segurança dos maiores bancos do mundo. Seus dados são criptografados e
                                            nunca compartilhados.
                                        </p>
                                        <Badge variant="outline">Segurança Bancária</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-foreground mb-6 text-3xl font-bold sm:text-4xl">Pronto para ter controle total das suas finanças?</h2>
                            <p className="text-muted-foreground mb-8 text-xl">
                                Junte-se a milhares de pessoas que já transformaram sua vida financeira com o ValorizeAI
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button size="lg" className="px-8 py-6 text-lg">
                                    Começar Gratuitamente
                                </Button>
                                <Button variant="outline" size="lg" className="bg-transparent px-8 py-6 text-lg">
                                    Falar com Especialista
                                </Button>
                            </div>
                            <p className="text-muted-foreground mt-6 text-sm">Teste grátis por 30 dias. Cancele quando quiser.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-border bg-muted/30 border-t">
                    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center space-x-2">
                                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                        <TrendingUp className="text-primary-foreground h-5 w-5" />
                                    </div>
                                    <span className="text-foreground text-xl font-bold">ValorizeAI</span>
                                </div>
                                <p className="text-muted-foreground">
                                    A plataforma completa para gestão financeira pessoal com inteligência artificial.
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold">Produto</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Recursos
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Preços
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Segurança
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            API
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold">Empresa</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Sobre
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Carreiras
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Contato
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold">Suporte</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Central de Ajuda
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Documentação
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Status
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-foreground transition-colors">
                                            Comunidade
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-border mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
                            <p className="text-muted-foreground">© 2024 ValorizeAI. Todos os direitos reservados.</p>
                            <div className="mt-4 flex space-x-6 sm:mt-0">
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Privacidade
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Termos
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
