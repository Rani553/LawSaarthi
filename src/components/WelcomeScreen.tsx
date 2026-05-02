// Drop-in replacement for: src/components/WelcomeScreen.tsx

interface Props {
  onSelectQuestion: (q: string) => void;
}

const SUGGESTIONS = [
  "What are my rights as a tenant?",
  "How to file a consumer complaint?",
  "Explain RTI Act in simple terms",
  "What is the process for property registration?",
];

const WelcomeScreen = ({ onSelectQuestion }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4 welcome-fade-in">
      <div className="mb-12">
        { <h1 className="text-4xl md:text-6xl font-bold floating-text">
          <span className="welcome-text-reveal inline-block text-gradient-accent">Welcome</span>{" "}
          <span className="welcome-text-reveal inline-block text-foreground">to</span>{" "}
          <span className="welcome-text-reveal inline-block text-gradient">Lawsarthi</span>
          
        </h1> 


        }

        <p
          className="text-lg md:text-xl text-muted-foreground mt-6 max-w-lg mx-auto welcome-text-reveal"
          style={{ animationDelay: "1.1s" }}
        >
          Your trusted AI legal assistant for Indian law
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(suggestion)}
            className="glass-card px-4 py-3 text-sm text-left hover:bg-secondary/50 transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${1.4 + index * 0.1}s` }}
          >
            <span className="text-muted-foreground hover:text-foreground transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          Voice Search
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Multi-language
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          24/7 Available
        </span>
      </div>
    </div>
  );
};

export default WelcomeScreen;
