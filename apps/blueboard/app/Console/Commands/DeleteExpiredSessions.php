<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\LibSession\RedisManager;
use App\Models\PersonalAccessToken;

class DeleteExpiredSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'session:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean expired sessions';

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
        $prepend = $time . ' (SessionCleaner) ';
        return $prepend . $msg;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $minutes = config('sanctum.expiration');
        $timestamp = date('Y-m-d H:i:s', strtotime("-$minutes minutes", time()));

        $tokens = PersonalAccessToken::where('created_at', '<', $timestamp)->get();
        $count = $tokens->count();
        if ($count == 0) {
            $this->info($this->makeLogMessage('# No expired sessions found.'));
        } else {
            $this->info($this->makeLogMessage("# Found $count expired sessions!"));

            $this->info($this->makeLogMessage('# Cleaning...'));
            foreach ($tokens as $token) {
                $manager = new RedisManager($token->token);
                $manager->deleteIfExists();
                $token->delete();
            }

            $this->info($this->makeLogMessage('# Done!'));
        }

        return 0;
    }
}
