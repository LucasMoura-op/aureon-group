"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const examples = [
  "Esse negócio compensa?",
  "Qual cenário me quebra?",
  "Quanto posso me alavancar?",
  "O que estou esquecendo?",
  "Qual projeto é melhor?"
];

export function AIConsultant() {
  const [question, setQuestion] = useState(examples[0]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(value = question) {
    setLoading(true);
    const response = await fetch("/api/ai/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: value })
    });
    const data = await response.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.35fr_0.65fr]">
      <Card>
        <CardHeader>
          <CardTitle>Perguntas críticas</CardTitle>
          <CardDescription>Atalhos para decisões que exigem cálculo, margem e risco.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {examples.map((example) => (
            <Button key={example} variant="outline" className="w-full justify-start" onClick={() => { setQuestion(example); void ask(example); }}>
              {example}
            </Button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>IA consultiva interna</CardTitle>
          </div>
          <CardDescription>Resposta explicável baseada em fluxo de caixa, ROI, cenários, dívida, patrimônio e riscos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={question} onChange={(event) => setQuestion(event.target.value)} />
            <Button onClick={() => ask()} disabled={loading} aria-label="Perguntar">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-72 rounded-lg border bg-muted/30 p-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Analisando cenários e procurando pontos cegos...</p>
            ) : answer ? (
              <div className="whitespace-pre-line text-sm leading-6">{answer}</div>
            ) : (
              <p className="text-sm text-muted-foreground">Faça uma pergunta para receber uma análise sem promessa de certeza absoluta, com riscos e alternativas.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
