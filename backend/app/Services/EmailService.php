<?php

namespace App\Services;

 use Illuminate\Support\Facades\Storage;
use Webklex\IMAP\Facades\Client;

class EmailService
{
    public static function fetchAllEmails()
    {
        try {
            error_log('Attempting to connect to IMAP server...');
            $client = Client::account('default');
            $client->connect();
            error_log('Successfully connected to IMAP server.');
        } catch (\Webklex\PHPIMAP\Exceptions\ConnectionFailedException $e) {
            error_log('IMAP connection failed: ' . $e->getMessage());
            return json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        }

        try {
            $folder = $client->getFolder('INBOX');
            $messages = $folder->query()->all()->get();
        } catch (\Exception $e) {
            error_log('Error fetching emails: ' . $e->getMessage());
            return json_encode(['error' => 'Error fetching emails: ' . $e->getMessage()]);
        }

        $emails = '';
        foreach ($messages as $message) {
            $messageId = $message->getMessageId();
            if ($messageId) {
                $emails  = $emails .'\n'. $messageId; // Добавляем идентификатор сообщения в массив
            }
        }

        return json_encode($emails);
    }
    public static function fetchEmailById($messageId)
    {
        try {
            error_log('Attempting to connect to IMAP server...');
            $client = Client::account('default');
            $client->connect();
            error_log('Successfully connected to IMAP server.');
        } catch (\Webklex\PHPIMAP\Exceptions\ConnectionFailedException $e) {
            error_log('IMAP connection failed: ' . $e->getMessage());
            return json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        }

        try {
            $folder = $client->getFolder('INBOX');
            $message = $folder->query()->whereMessageId($messageId)->get()->first();
        } catch (\Exception $e) {
            error_log('Error fetching email: ' . $e->getMessage());
            return json_encode(['error' => 'Error fetching email: ' . $e->getMessage()]);
        }

        if (!$message) {
            return json_encode(['error' => 'Message not found']);
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

        return json_encode($email);
    }
}
