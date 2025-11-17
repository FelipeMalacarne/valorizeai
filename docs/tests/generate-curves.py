import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

# -------------------------------------------------------------------
# CONFIGURAÇÃO
# -------------------------------------------------------------------

BASE = "."  # diretório base (onde estão 1-test-read, 2-test-mixed, etc.)

TESTS = {
    "read":  {
        "csv": "1-test-read/transactions.csv",
        "stages": [
            ("2m", 150),
            ("3m", 300),
            ("4m", 600),
            ("4m", 900),
            ("2m", 1000),
            ("2m", 0),
        ],
        "min_vu": 0,   # sem recorte
    },
    "mixed": {
        "csv": "2-test-mixed/rw.csv",
        "stages": [
            ("2m", 30),
            ("3m", 80),
            ("4m", 180),
            ("4m", 350),
            ("4m", 550),
            ("4m", 650),
            ("2m", 0),
        ],
        "min_vu": 0,   # sem recorte (mude aqui se quiser começar ex.: em 200 VUs)
    },
}

BINS = 50          # número de faixas de VU na curva
SMOOTH = 3         # smoothing (rolling) nas curvas resultantes
SLO_P95 = 450


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------
def find_slo_break(vu_centers, curve95, SLO):
    for x, y in zip(vu_centers, curve95):
        if y > SLO:
            return x, y
    return None, None

def parse_duration(d):
    """Converte '2m' -> 120, '30s' -> 30."""
    if d.endswith("m"):
        return int(d[:-1]) * 60
    if d.endswith("s"):
        return int(d[:-1])
    raise ValueError(f"Duração inválida: {d}")


def build_vu_curve(stages):
    """Reconstrói a curva de VUs por segundo a partir das stages."""
    vu_list = []
    current_vu = 0
    t = 0
    for duration, target in stages:
        dur_s = parse_duration(duration)
        start = current_vu
        end = target
        values = np.linspace(start, end, dur_s)
        for v in values:
            vu_list.append((t, v))
            t += 1
        current_vu = target
    return pd.DataFrame(vu_list, columns=["sec", "vu"])


def process_test(name, cfg):
    print(f"\n▶ Processando teste: {name}")

    csv_path = os.path.join(BASE, cfg["csv"])
    stages = cfg["stages"]
    min_vu = cfg["min_vu"]

    # -----------------------------
    # 1) Carregar CSV do k6
    # -----------------------------
    df = pd.read_csv(csv_path, low_memory=False)

    # normalizar timestamps
    df["timestamp"] = pd.to_numeric(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["timestamp"])
    df = df.sort_values("timestamp")
    df["t"] = df["timestamp"] - df["timestamp"].min()
    df["sec"] = (df["t"] // 1).astype(int)

    # pegar apenas latências HTTP
    lat = df[df["metric_name"] == "http_req_duration"].copy()

    # P50/P95/P99 por segundo
    p50_sec = lat.groupby("sec")["metric_value"].quantile(0.50)
    p95_sec = lat.groupby("sec")["metric_value"].quantile(0.95)
    p99_sec = lat.groupby("sec")["metric_value"].quantile(0.99)

    # -----------------------------
    # 2) Construir timeline com VUs
    # -----------------------------
    vu_df = build_vu_curve(stages)

    max_sec = int(max(vu_df["sec"].max(), p95_sec.index.max()))
    timeline = pd.DataFrame({"sec": range(max_sec + 1)})

    vu_series = vu_df.set_index("sec")["vu"].reindex(timeline["sec"]).ffill()
    timeline["vu"] = vu_series.values
    timeline["p50"] = p50_sec.reindex(timeline["sec"]).ffill()
    timeline["p95"] = p95_sec.reindex(timeline["sec"]).ffill()
    timeline["p99"] = p99_sec.reindex(timeline["sec"]).ffill()

    # -----------------------------
    # 3) (Opcional) recortar por VU
    # -----------------------------
    if min_vu > 0:
        timeline = timeline[timeline["vu"] >= min_vu].copy()
        timeline.reset_index(drop=True, inplace=True)

    # segundos realmente utilizados no gráfico
    secs_usados = timeline["sec"].unique()

    # P95 global baseado APENAS nos dados brutos desses segundos
    lat_range = lat[lat["sec"].isin(secs_usados)]
    p95_global = lat_range["metric_value"].quantile(0.95)

    # -----------------------------
    # 4) Bucketizar por faixas de VU
    # -----------------------------
    timeline["vu_bin"] = pd.cut(timeline["vu"], bins=BINS)

    curve50 = (
        timeline.groupby("vu_bin", observed=True)["p50"]
        .median()
        .rolling(SMOOTH, min_periods=1)
        .mean()
    )
    curve95 = (
        timeline.groupby("vu_bin", observed=True)["p95"]
        .median()
        .rolling(SMOOTH, min_periods=1)
        .mean()
    )
    curve99 = (
        timeline.groupby("vu_bin", observed=True)["p99"]
        .median()
        .rolling(SMOOTH, min_periods=1)
        .mean()
    )
    vu_centers = timeline.groupby("vu_bin", observed=True)["vu"].median()

    # -----------------------------
    # 5) Plot individual P50/P95/P99
    # -----------------------------
    #
    plt.figure(figsize=(12,6))
    plt.plot(vu_centers, curve50, label="P50", linewidth=2)
    plt.plot(vu_centers, curve95, label="P95", linewidth=2)
    plt.plot(vu_centers, curve99, label="P99", linewidth=2)

    # Linha horizontal P95 GLOBAL
    plt.axhline(p95_global, color="gray", linestyle=":", linewidth=2,
                label=f"P95 global ({p95_global:.1f} ms)")

    # Linha horizontal SLO
    plt.axhline(SLO_P95, color="red", linestyle="--", linewidth=2,
                label=f"SLO ({SLO_P95} ms)")


# Marcador do ponto onde o P95 passa do SLO
    x_break, y_break = find_slo_break(vu_centers, curve95, SLO_P95)

    if x_break:
        plt.axvline(x_break, color="#CC0000", linestyle=":", linewidth=1.8)
        plt.text(
            x_break, max(curve95)*0.95,
            f"Violação do SLO\n≈ {int(x_break)} VUs",
            color="#CC0000",
            ha="center", va="top", fontsize=10,
            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="#CC0000")
        )

    plt.xlabel("Usuários Virtuais (VUs)")
    plt.ylabel("Latência (ms)")
    plt.title(f"Latência P50/P95/P99 por carga (VUs) – {name}")
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.legend()
    plt.tight_layout()

    out = f"fig-{name}-pxx.png"
    plt.savefig(out, dpi=200)
    plt.close()
    print(f"✔ Gráfico gerado: {out}")
    print(f"   P95 global (faixa plotada) = {p95_global:.2f} ms")

    # retorna curva P95 por VU para o gráfico comparativo
    return vu_centers, curve95


# -------------------------------------------------------------------
# EXECUÇÃO: dois testes + comparativo
# -------------------------------------------------------------------

vu_read, p95_read = process_test("read", TESTS["read"])
vu_mix, p95_mix = process_test("mixed", TESTS["mixed"])

# gráfico comparativo: P95 leitura vs misto
plt.figure(figsize=(12,6))
plt.plot(vu_read, p95_read, label="Leitura – P95", linewidth=2)
plt.plot(vu_mix, p95_mix, label="Misto – P95", linewidth=2)

# Linha SLO no comparativo
plt.axhline(SLO_P95, color="red", linestyle="--", linewidth=2,
            label=f"SLO ({SLO_P95} ms)")

x_break, y_break = find_slo_break(vu_mix, p95_mix, SLO_P95)

if x_break:
    plt.axvline(x_break, color="#CC0000", linestyle=":", linewidth=1.8)
    plt.text(
        x_break, max(p95_mix)*0.95,
        f"Violação do SLO\n≈ {int(x_break)} VUs",
        color="#CC0000",
        ha="center", va="top", fontsize=10,
        bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="#CC0000")
    )


plt.xlabel("Usuários Virtuais (VUs)")
plt.ylabel("Latência P95 (ms)")
plt.title("Comparação de Latência P95 – Leitura vs Cenário Misto")
plt.grid(True, linestyle="--", alpha=0.3)
plt.legend()
plt.tight_layout()

plt.savefig("fig-compare-read-vs-mixed.png", dpi=200)
plt.close()

print("\n✔ Gráfico comparativo gerado: fig-compare-read-vs-mixed.png")

