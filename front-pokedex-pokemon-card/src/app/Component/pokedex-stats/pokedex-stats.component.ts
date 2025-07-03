import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokedexService } from '../../Services/pokedexService/pokedex.service';
import { Pokedex, PokedexStats } from '../../Models/pokedex';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-pokedex-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex-stats.component.html',
  styleUrls: ['./pokedex-stats.component.scss'],
})
export class PokedexStatsComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  pokedexId: number = 0;

  pokedex: Pokedex | null = null;
  stats: PokedexStats | null = null;

  constructor(
    private pokedexService: PokedexService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pokedexId = Number(params.get('pokedexId'));

      this.pokedexService.getStats(this.pokedexId).subscribe((r) => {
        this.stats = r;
        this.initChartData(r);
      });
      this.pokedexService.getById(this.pokedexId).subscribe((r) => {
        this.pokedex = r;
      });
    });
  }

  initChartData(stats: PokedexStats | null): void {
    if (!stats || !this.chartCanvas) {
      return;
    }

    // Préparer les labels et données
    const labels = stats.pokedexValuationHistory.map(
      (h) => new Date(h.recordedAt).toISOString().split('T')[0]
    );
    const dataValues = stats.pokedexValuationHistory.map((h) => h.totalValue);

    // Si un graphique existe déjà, on le détruit avant de créer un nouveau
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: stats.title,
            data: dataValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Prix d’achat',
            data: labels.map(() => stats.acquiredPriceTotal),
            fill: false,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            borderDash: [5, 5],
            pointRadius: 0,
            pointHitRadius: 10,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
              maxRotation: 45,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: false,
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.formattedValue;
                return `${label}: ${value} €`;
              },
            },
          },
        },
      },
    });
  }
}
