<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Webklex\IMAP\Facades\Client;
use Illuminate\Support\Facades\Storage;

class EmailController extends Controller
{
    public function fetchEmail($messageId)
    {
        $client = Client::account('default');
        $client->connect();

        $folder = $client->getFolder('INBOX');
        $message = $folder->query()->whereMessageId($messageId)->get()->first();

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        $attachments = [];
        foreach ($message->getAttachments() as $attachment) {
            $filename = 'emails/' . $attachment->getName();
            Storage::put($filename, $attachment->content);
            $attachments[] = $filename;
        }

        $email = [
            'subject' => $message->getSubject(),
            'date' => $message->getDate()->toString(),
            'body' => $message->getHTMLBody(true) ?: $message->getTextBody(),
            'attachments' => $attachments,
        ];

        return response()->json($email);
    }
}
