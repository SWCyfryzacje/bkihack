# `@/api` — warstwa danych Wotum

Wszystko importuj z `@/api`. Funkcje rzucają `Error` z polskim komunikatem (`e.message` nadaje się do pokazania użytkownikowi).

## Typy i etykiety

```ts
import { CATEGORY_LABELS, LEVEL_LABELS, type Proposal } from '@/api';

CATEGORY_LABELS[proposal.category]; // 'Zadanie dla miasta'
LEVEL_LABELS[proposal.scope]; // 'Osiedle' | 'Okręg' | 'Miasto'
```

`Proposal` = wiersz widoku `proposals_with_counts` (m.in. `votes_up`, `votes_down`, `threshold` — próg awansu, `null` na poziomie miasta, `area_name`, `author_first_name`).

## Logowanie

```ts
import {
  signUp,
  verifySignUpCode,
  resendSignUpCode,
  signIn,
  signOut,
  useSession,
} from '@/api';

await signUp({ email, password, firstName, lastName, areaId: 'rubinkowo' });
// bez sesji → na maila poszedł kod (ekran /(auth)/verify)
await verifySignUpCode(email, '123456'); // loguje od razu
await resendSignUpCode(email);
await signIn(email, password); // EmailNotConfirmedError, gdy konto bez kodu
await signOut();

const { session, loading } = useSession(); // session === null → niezalogowany
```

## Obszary i profil

```ts
const { areas, loading, error } = useAreas('osiedle'); // do pickera przy rejestracji
const all = await fetchAreas(); // posortowane po nazwie
const me = await fetchMyProfile(); // null, gdy niezalogowany
```

## Propozycje

```ts
const { proposals, loading, error, refresh } = useProposals({ areaId: 'rubinkowo' });
// lista sama się odświeża (realtime) po każdym głosie i nowej propozycji

const one = await fetchProposal(id);
const created = await createProposal({
  title: 'Ławki na skwerze',
  body: 'Brakuje miejsc do siedzenia…',
  category: 'general',
  areaId: 'rubinkowo',
});
```

Filtr: `{ areaId?, scope? }` — `scope: 'miasto'` pokaże wszystko, co awansowało na poziom miasta.

## Głosy

```ts
const result = await castVote(proposal.id); // za; castVote(id, -1) = przeciw
if (result.escalated) toast(`Awansowała na poziom: ${LEVEL_LABELS[result.scope]}!`);

await removeVote(proposal.id);
const myVotes = await fetchMyVotes(); // { [proposalId]: 1 | -1 }
```

## Eskalacje na żywo (toast w demo)

```ts
useEscalations((e) => toast(`Propozycja awansowała: ${LEVEL_LABELS[e.to_scope]}!`));
```

## Token MCP

```ts
const token = await createMcpToken(); // pokaż raz; nowy unieważnia poprzedni
const url = mcpConnectorUrl(token); // https://mcp.jutropolskie.pl/mcp/<token>
```

Gotowy ekran: `src/app/connect-ai.tsx` (trasa `/connect-ai`). Wystarczy podlinkować go np. z panelu:
`<Link href='/connect-ai'>Połącz z AI</Link>`.

## Typy bazy

`database.types.ts` jest wygenerowany z bazy (Supabase MCP `generate_typescript_types`). Nie edytuj go ręcznie — po zmianie migracji wygeneruj ponownie.
