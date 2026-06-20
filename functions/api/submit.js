const ORCAMENTO_LABELS = {
  'ate-2k':     'Até R$ 2.000',
  '2k-5k':      'R$ 2.000 – R$ 5.000',
  '5k-15k':     'R$ 5.000 – R$ 15.000',
  'acima-15k':  'Acima de R$ 15.000',
  'nao-anuncio':'Ainda não anuncio',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  let nome, whatsapp, orcamento;
  try {
    const fd = await request.formData();
    nome      = (fd.get('nome')      || '').trim() || '—';
    whatsapp  = (fd.get('whatsapp')  || '').trim() || '—';
    orcamento = fd.get('orcamento') || '';
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return json({ ok: false, error: 'not_configured' }, 500);

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: '🎯 Novo lead — NexusGT',
        color: 0xF97316,
        fields: [
          { name: 'Nome',             value: nome,                                       inline: true  },
          { name: 'WhatsApp',         value: whatsapp,                                   inline: true  },
          { name: 'Orçamento mensal', value: ORCAMENTO_LABELS[orcamento] || orcamento,   inline: false },
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  });

  if (!res.ok) return json({ ok: false, error: 'discord_error' }, 502);

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
