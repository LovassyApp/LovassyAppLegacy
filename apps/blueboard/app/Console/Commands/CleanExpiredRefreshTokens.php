<?php

namespace App\Console\Commands;

use App\Helpers\LibRefresh\Models\RefreshToken;
use Illuminate\Console\Command;

class CleanExpiredRefreshTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans expired refresh tokens from the database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    private function makeLogMessage(string $msg)
    {
        $time = date('Y-m-d H:i:s');
        $prepend = $time . ' (RefreshTokenCleaner) ';
        return $prepend . $msg;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tokens = RefreshToken::where('expires_at', '<', time())->get();
        $count = $tokens->count();

        if ($count === 0) {
            $this->info($this->makeLogMessage('# No expired RefreshTokens found'));
        } else {
            $this->info($this->makeLogMessage("# Found $count expired RefreshTokens!"));
            $this->info($this->makeLogMessage('# Cleaning...'));
            foreach ($tokens as $token) {
                $token->metadata()->delete();
                $token->delete();
            }

            $this->info($this->makeLogMessage('# Done!'));
        }

        return 0;
    }
}
