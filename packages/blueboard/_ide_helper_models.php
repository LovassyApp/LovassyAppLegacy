<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Grade
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property int|null $lolo_id
 * @property string $uid
 * @property string $date
 * @property string $subject
 * @property string $teacher
 * @property string $name
 * @property string $type
 * @property int $grade
 * @property string $gradeType
 * @property string $gradeText
 * @property int $weight
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade query()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGradeText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGradeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereLoloId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereTeacher($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereWeight($value)
 */
	class Grade extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\KretaCred
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property string $username
 * @property string $password
 * @property string|null $token
 * @property string|null $refreshToken
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred query()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUsername($value)
 */
	class KretaCred extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string|null $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Grade[] $grades
 * @property-read int|null $grades_count
 * @property-read \App\Models\KretaCred|null $kreta
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

