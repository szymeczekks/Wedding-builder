import { model, Schema, Types } from "mongoose";
import { IGuest } from "../guest/guest.model";
import { trim } from "validator";

const defaultChecklist = [
    {
        "title": "12-18 miesięcy przed ślubem: Wielkie Marzenia",
        "todos": [
            {
                "title": "Ustalenie budżetu",
                "description": "Zanim zaczniecie marzyć o locie balonem, sprawdźcie, czy budżet nie skończy się na locie papierowym samolotem. Ustalcie kwotę, której nie chcecie przekroczyć."
            },
            {
                "title": "Wstępna lista gości",
                "description": "Spiszcie wszystkich: od ukochanej babci po kuzyna, którego widzieliście raz w 2005 roku. To zdefiniuje rozmiar sali."
            },
            {
                "title": "Wybór daty i rezerwacja sali",
                "description": "Sala to serce wesela. Jeśli macie wymarzone miejsce, to ono najprawdopodobniej wybierze datę za Was (wolne terminy to rzadkość!)."
            },
            {
                "title": "Wybór 'Wielkiej Czwórki': Foto, Video, Muzyka, Florysta",
                "description": "Najlepsi usługodawcy mają kalendarze wypełnione na 2 lata do przodu. Rezerwujcie, zanim ktoś Was ubiegnie."
            }
        ]
    },
    {
        "title": "9-12 miesięcy przed ślubem: Styl i Forma",
        "todos": [
            {
                "title": "Poszukiwania sukni ślubnej i garnituru",
                "description": "Szycie sukni trwa miesiącami. Czas zacząć mierzyć, wybierać i zastanawiać się, czy biały to na pewno 'wasz biały'."
            },
            {
                "title": "Wybór świadków",
                "description": "Wybierzcie osoby, które ogarną Wasz stres i nie zgubią obrączek. Czas na oficjalne 'Czy zostaniesz moim świadkiem?'."
            },
            {
                "title": "Rezerwacja transportu dla gości i Pary Młodej",
                "description": "Limuzyna, dorożka, czy traktor? Czymkolwiek pojedziecie, upewnijcie się, że ma aktualny przegląd."
            }
        ]
    },
    {
        "title": "6 miesięcy przed ślubem: Formalności i Zaproszenia",
        "todos": [
            {
                "title": "Formalności w USC lub Parafii",
                "description": "Sprawdźcie daty ważności dokumentów. Pamiętajcie o naukach przedmałżeńskich, jeśli planujecie ślub kościelny."
            },
            {
                "title": "Zamówienie zaproszeń i papeterii",
                "description": "Wybierzcie design. Pamiętajcie o RSVP – musicie wiedzieć, kto wpadnie na schabowego, a kto jest weganinem."
            },
            {
                "title": "Wybór obrączek",
                "description": "Będziecie je nosić przez lata, więc upewnijcie się, że nie uwierają i... że zmieszczą się na palec po weselnym torcie."
            },
            {
                "title": "Planowanie podróży poślubnej",
                "description": "Zasłużony odpoczynek po bitwie. Sprawdźcie paszporty – muszą być ważne jeszcze min. 6 miesięcy od daty wyjazdu!"
            }
        ]
    },
    {
        "title": "3 miesiące przed ślubem: Detale i Degustacje",
        "todos": [
            {
                "title": "Degustacja menu i wybór tortu",
                "description": "Najlepszy punkt planowania. Jedzcie, próbujcie i wybierzcie tort, który przetrwa transport w upale."
            },
            {
                "title": "Rozsyłanie/rozdawanie zaproszeń",
                "description": "Czas ruszyć w miasto. Ostatnia szansa, by udawać, że nie ma Was w domu przed nielubianą ciocią."
            },
            {
                "title": "Zakup dodatków",
                "description": "Buty, bielizna, biżuteria, spinki do mankietów. Pamiętajcie: wygodne buty to klucz do przetrwania do rana."
            },
            {
                "title": "Kurs tańca (opcjonalnie)",
                "description": "Jeśli nie chcecie tylko deptać sobie po palcach przy 'Windą do nieba', czas na kilka lekcji walca lub bachaty."
            }
        ]
    },
    {
        "title": "1 miesiąc przed ślubem: Ostatnia Prosta",
        "todos": [
            {
                "title": "Próbny makijaż i fryzura",
                "description": "Sprawdźcie, czy w danej fryzurze nie wyglądacie jak własna babcia i czy makijaż wytrzyma próbę płaczu ze szczęścia."
            },
            {
                "title": "Ustalenie usadzenia gości",
                "description": "Najtrudniejsza zagadka logiczna świata. Kto z kim nie rozmawia, a kto kogo uwielbia – czas na puzzle z nazwiskami."
            },
            {
                "title": "Zakup alkoholu i napojów",
                "description": "Lepiej, żeby zostało, niż miałoby zabraknąć o 22:00. Policzcie dokładnie (i dodajcie 10% zapasu na 'zdrowie Pary Młodej')."
            },
            {
                "title": "Potwierdzenie ostatecznej liczby gości u managera sali",
                "description": "Kto potwierdził, ten je. Kto nie potwierdził... cóż, zawsze zostają poprawiny."
            }
        ]
    },
    {
        "title": "2 tygodnie przed ślubem: Logistyka Kryzysowa",
        "todos": [
            {
                "title": "Przygotowanie koszyka ratunkowego do łazienek",
                "description": "Plastry, agrafki, tabletki przeciwbólowe, rajstopy, guma do żucia. Wasi goście będą Wam wdzięczni jak za złoto."
            },
            {
                "title": "Rozchodzenie butów ślubnych",
                "description": "Chodźcie w nich po domu w grubych skarpetach. Wygląda się śmiesznie, ale pęcherze na weselu są gorsze."
            },
            {
                "title": "Przygotowanie playlisty dla DJ-a/Zespołu",
                "description": "Lista 'Must play' oraz 'Totalne zakazy' (jeśli 'Jesteś szalona' wywołuje u Was dreszcze, dajcie im znać)."
            }
        ]
    },
    {
        "title": "Tydzień przed ślubem: Relaks i Kontrola",
        "todos": [
            {
                "title": "Odbiór sukni i garnituru",
                "description": "Sprawdźcie, czy wszystko leży idealnie. Ostatnia przymiarka przed wielkim dniem."
            },
            {
                "title": "Przygotowanie kopert z płatnościami dla usługodawców",
                "description": "Przygotujcie gotówkę w opisanych kopertach. Nikt nie chce robić przelewów podczas oczepin."
            },
            {
                "title": "Pakowanie torby na noc poślubną",
                "description": "Szczoteczka do zębów, ubrania na zmianę i... coś na ból głowy (tak na wszelki wypadek)."
            }
        ]
    },
    {
        "title": "Dzień przed ślubem: Spokój ducha",
        "todos": [
            {
                "title": "Przygotowanie dokumentów (dowody osobiste!)",
                "description": "Bez nich ślubu nie będzie. Połóżcie je obok obrączek w widocznym miejscu."
            },
            {
                "title": "Odstawienie dekoracji i alkoholu na salę",
                "description": "Zróbcie to rano, żeby wieczór mieć wolny na relaksującą kąpiel i melisę."
            },
            {
                "title": "Wczesne pójście spać",
                "description": "Sen to najlepszy kosmetyk. Odłóżcie telefon, przestańcie sprawdzać prognozę pogody i śpijcie!"
            }
        ]
    },
    {
        "title": "Dzień Ślubu: TO JUŻ DZIŚ!",
        "todos": [
            {
                "title": "Zjedzenie pożywnego śniadania",
                "description": "Emocje odbierają apetyt, ale musicie mieć siłę na 'TAK' i kilka godzin życzeń. Nie mdlejcie z głodu!"
            },
            {
                "title": "Uśmiech i dobra zabawa",
                "description": "Nawet jeśli tort się lekko przechyli, a wujek Staszek opowie słaby żart – to Wasz dzień. Cieszcie się każdą sekundą!"
            }
        ]
    },
    {
        "title": "Po ślubie: Nowa droga życia",
        "todos": [
            {
                "title": "Zwrot wypożyczonych rzeczy",
                "description": "Garnitur, wazy, dekoracje – oddajcie je, zanim naliczą Wam karę za zwłokę."
            },
            {
                "title": "Wymiana dokumentów",
                "description": "Jeśli zmieniliście nazwisko, czas na rajd po urzędach (dowód, paszport, prawo jazdy, banki)."
            },
            {
                "title": "Wysłanie podziękowań gościom",
                "description": "Miły gest, który sprawi, że wszyscy poczują się docenieni za wspólną zabawę (i prezenty!)."
            }
        ]
    }
];

export interface IProject {
    _id: Types.ObjectId,
    name: string,
    creator?: string,
    sessionId?: string,
    newlyweds?: IGuest[],
    config: Record<string, any>;
    ceremony: Record<string, any>;
};
export interface IProjectCeremony {
    _id: Types.ObjectId,
    date?: Date | null,
    location?: {
        provider: string;
        payload: unknown;
    },
    description?: string | null,
};
export interface IProjectCeremonyInput {
    date?: Date,
    location?: {
        provider: string;
        payload: unknown;
    },
    description?: string,
};
export interface IChecklistTodoInput {
    title?: string,
    description?: string,
    done?: boolean,
};
export interface IChecklistStageUpdateInput {
    title: string,
};
export interface IChecklistTodo {
    _id: Types.ObjectId,
    title: string,
    description?: string | null,
    done: boolean,
};
export interface IChecklistStage {
    _id: Types.ObjectId,
    title: string,
    todos: IChecklistTodo[]
};

export interface ICheckListTodoDelete {
    _id: string
    stageId: string
    success: boolean
}
export interface ICheckListTodoCreateInput {
    title: string,
    description?: string | null,
}

const CeremonySchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: false
    },
    date: Date,
    location: Schema.Types.Mixed,
    description: String
});

const TodoSchema = new Schema({
    title: { type: String, required: true, trim: true, maxLength: 200 },
    description: { type: String, trim: true, maxLength: 1000 },
    done: { type: Boolean, default: false }
});

const ChecklistStageSchema = new Schema({
    title: { type: String, required: true, trim: true, maxLength: 200, minLength: 1 },
    todos: { type: [TodoSchema], default: [] }
});

const ProjectSchema = new Schema({
    name: { type: String, required: true, default: 'Bez tytułu' },
    creator: { type: String, default: null },
    sessionId: { type: String, default: null },
    config: { type: Schema.Types.Mixed, default: () => ({}) },
    ceremony: { type: CeremonySchema, required: true },
    checklist: {
        type: [ChecklistStageSchema],
        required: true,
        default: () => (defaultChecklist)
    },
    reception: { type: CeremonySchema, required: true },
}, {
    timestamps: true
});

export const Project = model('Project', ProjectSchema);