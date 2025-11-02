<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Color;

final class DefaultCategories
{
    /**
     * @return array<int, array{name: string, description: string, color: Color}>
     */
    public static function presets(): array
    {
        return [
            [
                'name'        => 'Alimentação',
                'description' => 'Restaurantes, supermercados e delivery.',
                'color'       => Color::RED,
            ],
            [
                'name'        => 'Transporte',
                'description' => 'Combustível, transporte público e manutenção.',
                'color'       => Color::BLUE,
            ],
            [
                'name'        => 'Compras',
                'description' => 'Vestuário, eletrônicos e outras compras.',
                'color'       => Color::MAUVE,
            ],
            [
                'name'        => 'Lazer',
                'description' => 'Cinema, jogos e atividades de lazer.',
                'color'       => Color::PINK,
            ],
            [
                'name'        => 'Contas & Utilidades',
                'description' => 'Energia, água, internet e telefone.',
                'color'       => Color::PEACH,
            ],
            [
                'name'        => 'Saúde',
                'description' => 'Consultas médicas, farmácia e plano de saúde.',
                'color'       => Color::GREEN,
            ],
            [
                'name'        => 'Educação',
                'description' => 'Cursos, livros e materiais de estudo.',
                'color'       => Color::SAPPHIRE,
            ],
            [
                'name'        => 'Viagens',
                'description' => 'Passagens, hospedagens e passeios.',
                'color'       => Color::TEAL,
            ],
            [
                'name'        => 'Receitas',
                'description' => 'Salários, freelas e outras entradas.',
                'color'       => Color::SKY,
            ],
            [
                'name'        => 'Poupança',
                'description' => 'Reservas, investimentos e objetivos.',
                'color'       => Color::LAVENDER,
            ],
        ];
    }
}
